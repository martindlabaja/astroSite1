@echo off
title Lets Resize it in Batch!
magick.exe mogrify -resize 500x500 -path ../../../../public/images *.jpg *.png
echo Resized images saved into \public\images!
pause