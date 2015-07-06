#!/bin/sh
  
current_time=$(date "+%Y.%m.%d-%H.%M.%S")

adb shell screencap -p "/sdcard/$current_time.png"
adb pull "/sdcard/$current_time.png"
adb shell rm "/sdcard/$current_time.png"

echo "Criando foto: $current_time.png"
open "$current_time.png"