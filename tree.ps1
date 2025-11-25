Param(
  [string]$Path = ".",
  [string[]]$Ignore = @("node_modules",".git",".vscode","dist","build",".prisma")
)

function Show-Tree {
  param(
    [string]$BasePath,
    [int]$Depth = 0
  )

  $items = Get-ChildItem -LiteralPath $BasePath -Force | Sort-Object Name
  $count = $items.Count
  $i = 0
  foreach ($item in $items) {
    $i++
    if ($Ignore -contains $item.Name) { continue }

    $prefix = ""
    if ($Depth -gt 0) {
      for ($d = 0; $d -lt $Depth; $d++) {
        $prefix += "|   "
      }
    }

    $isLast = ($i -eq $count)
    $connector = if ($isLast) { "\`--" } else { "|--" }

    Write-Host ($prefix + $connector + " " + $item.Name)

    if ($item.PSIsContainer) {
      Show-Tree -BasePath $item.FullName -Depth ($Depth + 1)
    }
  }
}

Write-Host ("Projeto: " + (Resolve-Path $Path)) -ForegroundColor Cyan
Show-Tree -BasePath (Resolve-Path $Path)