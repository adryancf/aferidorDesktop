# PyWMI-Script
A script for Microsoft WMI 

# Basic
- This script will used to get all Hardware and Software Information Automatically without Command Prompt or Powershell
- Easy to Use and no need to type a command on Command Prompt or Powershell
- This is made from scratch for Python Purposes

# Tutorial
```py
import WMIC

x = WMIC.WMIC()
# Get the Information from Motherbord Hardware Information and return dict()
print(x.getBaseboard())
# or
print(WMIC().getBaseboard())

# You can also use the 'serialnumber' from wmic baseboard -parag as key value in getBaseboard()
print(x.getBaseboard(key="serialnumber"))
print(x.getBaseboard()["serialnumber"])
```

# Request
Any request to add more on this Python Script? please send this Request into my Email Address on zekeredgrave@gmail.com or zeroredgrave@gmail.com
