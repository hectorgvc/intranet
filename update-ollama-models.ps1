[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$ContinueOnError
)

$ErrorActionPreference = 'Stop'

function Get-OllamaModels {
    $listOutput = & ollama list 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to list Ollama models.`n$listOutput"
    }

    $models = $listOutput |
        Select-Object -Skip 1 |
        ForEach-Object {
            $line = $_.ToString().Trim()
            if (-not $line) { return }
            ($line -split '\s+')[0]
        } |
        Where-Object { $_ -and $_ -ne 'NAME' } |
        Sort-Object -Unique

    return @($models)
}

try {
    if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
        throw "The 'ollama' CLI was not found in PATH."
    }

    $models = Get-OllamaModels
    if ($models.Count -eq 0) {
        Write-Host "No installed Ollama models found."
        exit 0
    }

    Write-Host "Found $($models.Count) installed model(s)."
    if ($DryRun) {
        Write-Host "DryRun enabled. No pulls will be executed."
    }

    $results = New-Object System.Collections.Generic.List[object]

    for ($i = 0; $i -lt $models.Count; $i++) {
        $model = $models[$i]
        $current = $i + 1
        $percent = [int](($current / $models.Count) * 100)

        Write-Progress -Activity "Updating Ollama models" -Status "[$current/$($models.Count)] $model" -PercentComplete $percent

        if ($DryRun) {
            Write-Host "[$current/$($models.Count)] [DRY RUN] Would update: $model"
            $results.Add([pscustomobject]@{
                Model    = $model
                Status   = 'SKIPPED'
                Duration = [TimeSpan]::Zero
                Error    = $null
            })
            continue
        }

        $start = Get-Date
        $pullOutput = & ollama pull $model 2>&1
        $duration = (Get-Date) - $start

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[$current/$($models.Count)] OK: $model ($([math]::Round($duration.TotalSeconds, 1))s)"
            $results.Add([pscustomobject]@{
                Model    = $model
                Status   = 'OK'
                Duration = $duration
                Error    = $null
            })
        } else {
            $errorText = ($pullOutput | Out-String).Trim()
            Write-Warning "[$current/$($models.Count)] FAILED: $model"
            $results.Add([pscustomobject]@{
                Model    = $model
                Status   = 'FAILED'
                Duration = $duration
                Error    = $errorText
            })

            if (-not $ContinueOnError) {
                throw "Stopping on first failure. Model: $model`n$errorText"
            }
        }
    }

    Write-Progress -Activity "Updating Ollama models" -Completed

    Write-Host ""
    Write-Host "Update summary:"
    $results |
        Select-Object Model, Status, @{Name='Seconds';Expression={[math]::Round($_.Duration.TotalSeconds, 1)}} |
        Format-Table -AutoSize

    $failed = @($results | Where-Object { $_.Status -eq 'FAILED' })
    if ($failed.Count -gt 0) {
        Write-Host ""
        Write-Host "Failed models:" -ForegroundColor Yellow
        foreach ($item in $failed) {
            Write-Host "- $($item.Model)"
            if ($item.Error) {
                Write-Host $item.Error -ForegroundColor DarkYellow
            }
        }
        exit 1
    }

    exit 0
}
catch {
    Write-Progress -Activity "Updating Ollama models" -Completed
    Write-Error $_
    exit 1
}
