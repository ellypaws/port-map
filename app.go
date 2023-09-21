package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
	"sync"
)

type App struct {
	mu             sync.Mutex
	tcpConnections []TcpConnection
	ctx            context.Context
}

type TcpConnection struct {
	LocalAddress  string `json:"LocalAddress"`
	LocalPort     int    `json:"LocalPort"`
	OwningProcess int    `json:"OwningProcess"`
	Process       string `json:"Process"`
}

func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {}

func (a *App) GetTcpConnections() string {
	cmdTxt := `Get-NetTcpConnection -State Listen | ` +
		`Select-Object LocalAddress,LocalPort,OwningProcess,@{` +
		`Name="Process";Expression={(Get-Process -Id $_.OwningProcess).ProcessName}} | ` +
		`Sort-Object -Property LocalPort | ConvertTo-Json`

	// Execute the PowerShell command
	cmd := exec.Command("powershell", "-command", cmdTxt)
	output, err := cmd.CombinedOutput()

	// Error handling
	if err != nil {
		panic(err)
	}

	// Update the connections to the latest
	a.mu.Lock()
	err = json.Unmarshal(output, &a.tcpConnections)
	a.mu.Unlock()

	// surround ipv6 addresses with brackets. if string contains a colon, it's ipv6. Use strings.Contains()
	for i := range a.tcpConnections {
		if strings.Contains(a.tcpConnections[i].LocalAddress, ":") {
			a.tcpConnections[i].LocalAddress = "[" + a.tcpConnections[i].LocalAddress + "]"
		}
	}

	if err != nil {
		panic(err)
	}

	// return the connections in json string format
	return string(output)
}

func (a *App) TerminateProcess(index int) {
	if index >= 0 && index < len(a.tcpConnections) {
		cmd := exec.Command("taskkill", "/F", "/PID", fmt.Sprintf("%d", a.tcpConnections[index].OwningProcess))
		err := cmd.Run()
		if err != nil {
			panic(err)
		}

		msg := fmt.Sprintf("Terminated process %d (%s)\n", a.tcpConnections[index].OwningProcess, a.tcpConnections[index].Process)
		fmt.Println(msg)
	}
}
