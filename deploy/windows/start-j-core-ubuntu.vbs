Option Explicit

Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run """C:\Windows\System32\wsl.exe"" -d Ubuntu -u root -- /bin/sleep infinity", 0, False
