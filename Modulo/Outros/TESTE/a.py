import WMIC

x = WMIC.WMIC()
# Get the Information from Motherbord Hardware Information and return dict()
print(x.getBaseboard())
# or
#print(WMIC().getBaseboard())

# You can also use the 'serialnumber' from wmic baseboard -parag as key value in getBaseboard()
print(x.getBaseboard(key="serialnumber"))
print(x.getBaseboard()["serialnumber"])