@echo off
title Lets Resize it in Batch!
magick.exe mogrify -format jpg -path ../../../../public/images *.png 
magick.exe mogrify -resize 500x500 -path ../../../../public/images *.jpg
echo Welcome!
pause