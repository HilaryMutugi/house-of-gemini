Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root 'assets'
$files = @(
  'charcoal-work-coverall-mockup-3.png',
  'charcoal-gray-short-sleeved-uniform-shirt-1.png',
  'charcoal-straight-leg-uniform-trousers-2.png',
  'gray-blazer-product-mockup-2.png',
  'charcoal-gray-uniform-skirt-with-contrast-trim-4.png'
)
foreach ($file in $files) {
  $source = [System.Drawing.Bitmap]::FromFile((Join-Path $assets $file))
  $clean = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $fabric = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $trim = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      $p = $source.GetPixel($x,$y)
      $bright = ($p.R + $p.G + $p.B) / 3
      $spread = [Math]::Max($p.R,[Math]::Max($p.G,$p.B)) - [Math]::Min($p.R,[Math]::Min($p.G,$p.B))
      $isBackdrop = $bright -gt 158 -and $spread -lt 28
      $alpha = if ($isBackdrop) { 0 } else { 255 }
      $clean.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,$p.R,$p.G,$p.B))
      if ($alpha -eq 0) { $fabric.SetPixel($x,$y,[System.Drawing.Color]::Transparent); $trim.SetPixel($x,$y,[System.Drawing.Color]::Transparent); continue }
      $trimLike = $bright -gt 145 -and $spread -lt 24
      if ($trimLike) { $trim.SetPixel($x,$y,[System.Drawing.Color]::FromArgb(255,255,255,255)); $fabric.SetPixel($x,$y,[System.Drawing.Color]::Transparent) }
      else { $fabric.SetPixel($x,$y,[System.Drawing.Color]::FromArgb(255,255,255,255)); $trim.SetPixel($x,$y,[System.Drawing.Color]::Transparent) }
    }
  }
  $stem = [System.IO.Path]::GetFileNameWithoutExtension($file)
  $clean.Save((Join-Path $assets "$stem-clean.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $fabric.Save((Join-Path $assets "$stem-fabric-mask.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $trim.Save((Join-Path $assets "$stem-trim-mask.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $source.Dispose(); $clean.Dispose(); $fabric.Dispose(); $trim.Dispose()
}
