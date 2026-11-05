# Generates local Windows TTS sound checks only. These files are DEMO / NON_VALIDE.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$output = Join-Path (Get-Location) 'public\media\demo'
New-Item -ItemType Directory -Force -Path $output | Out-Null
$samples = @(
  @{ locale = 'fr'; voice = 'Microsoft Hortense'; file = 'tts-demo-fr-local.wav'; text = "Ceci est un échantillon de voix de synthèse pour vérifier le lecteur audio de Sîra. Il ne contient aucun récit historique et ne constitue pas une publication." },
  @{ locale = 'ar'; voice = 'Microsoft Naayf'; file = 'tts-demo-ar-local.wav'; text = "هذه عينة صوتية اصطناعية للتحقق من مشغل الصوت في سيرة. لا تتضمن أي رواية تاريخية وليست مخصصة للنشر." }
)
$records = @()
foreach ($sample in $samples) {
  $target = Join-Path $output $sample.file
  $synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
  try {
    try { $synth.SelectVoice($sample.voice) } catch { throw "La voix locale $($sample.voice) n'est pas disponible pour la synthèse dans cet environnement." }
    $synth.SetOutputToWaveFile($target)
    $synth.Speak($sample.text)
  } finally {
    $synth.Dispose()
  }
  $bytes = [System.IO.File]::ReadAllBytes($target)
  if ($bytes.Length -lt 44 -or [System.Text.Encoding]::ASCII.GetString($bytes, 0, 4) -ne 'RIFF' -or [System.Text.Encoding]::ASCII.GetString($bytes, 8, 4) -ne 'WAVE') { throw "Invalid WAV written for $($sample.locale)." }
  $byteRate = [BitConverter]::ToInt32($bytes, 28); $dataLength = [BitConverter]::ToInt32($bytes, 40)
  if ($byteRate -le 0 -or $dataLength -le 0) { throw "Unmeasurable WAV written for $($sample.locale)." }
  $records += [ordered]@{ file = $sample.file; locale = $sample.locale; provider = 'windows-system-speech'; voice = $sample.voice; durationSeconds = [Math]::Round($dataLength / $byteRate, 2); sha256 = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLowerInvariant(); status = 'DEMO_NON_VALIDE'; publicationAllowed = $false; statement = 'Local technical sound check only; not a historical narration.' }
  Write-Output "$($sample.file): $($records[-1].durationSeconds) seconds; DEMO NON VALIDE"
}
$provenance = [ordered]@{ generatedAt = [DateTime]::UtcNow.ToString('o'); samples = $records }
$provenance | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $output 'tts-demo-local-provenance.json') -Encoding utf8
