@echo off
title This is your first batch script!
mkdir 250x250
magick.exe mogrify -resize 250x250 -path ../public/images *.png *.jpg
echo Welcome to batch scripting!
pause