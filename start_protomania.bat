@echo off
title PROTOMANIA — AI-Powered Fitness & Budget Platform
color 0A
echo =================================================================
echo   PROTOMANIA ⚡ Your Body. Your Budget. Your Era.
echo   Launching web application & Developer Hub...
echo =================================================================
cd /d "%~dp0"
call .venv\Scripts\python.exe run.py
pause
