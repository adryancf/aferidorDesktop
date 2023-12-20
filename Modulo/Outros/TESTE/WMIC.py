'''

The WMI command-line (WMIC) utility provides a command-line interface for Windows Management Instrument(WMI).
This Class is only use to get all Computer Information from Software to Hardware using Windows OS from Microsoft.

Author: Zeke Redgrave
Version: 2

'''
import xml.etree.ElementTree as ET, subprocess, json, os, platform, sys

class WMIC:
	def __init__(self):
		# Global Variable
		self.startupinfo = subprocess.STARTUPINFO()
		self.startupinfo.dwFlags = subprocess.STARTF_USESHOWWINDOW
		self.startupinfo.wShowWindow = subprocess.SW_HIDE

		if self.checkWindowsOS() is False: raise Exception("The OS you running is not Available!")

	def getBaseboard(self, key=""):
		'''
		Method: Return Dictionary
		Command: wmic baseboard list /format:rawxml

		Description:
			-> WMIC().getBaseboard()['key'] or WMIC().getBaseboard(key="mykey") return dict()
		'''
		Motherboard = {}
		root = ET.fromstring(str(subprocess.Popen("wmic baseboard list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0][0]:
			for b in a: Motherboard[a.attrib['NAME'].lower()] = b.text

		return Motherboard if key == "" else Motherboard[key.lower()]

	def getProcessor(self, key=""):
		'''
		Method: Return Dictionary
		Command: wmic cpu list /format:rawxml
		
		Description:
			-> WMIC().getComputerProcessingUnit()['key'] or WMIC().getComputerProcessingUnit(key="mykey") return dict()
		'''
		Processor = {}
		root = ET.fromstring(str(subprocess.Popen("wmic cpu list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0][0]:
			for b in a: Processor[a.attrib['NAME'].lower()] = b.text

		return Processor if key == "" else Processor[key.lower()]

	def getMemoryCard(self, index=None):
		'''
		Method: Return List
		Command: wmic memorychip list /format:rawxml

		Description:
			-> WMIC().getComputerProcessingUnit() return list() data inside of dict()
			-> Get an Information from Memory Card or RAM called today
			-> WMIC().getMemoryCard(index=0) or WMIC().getMemoryCard()[0] return dict()
		'''
		Memory = []
		root = ET.fromstring(str(subprocess.Popen("wmic memorychip list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0]:
			_Memory = {}

			for b in a:
				for c in b: _Memory[b.attrib['NAME'].lower()] = c.text

			Memory.append(_Memory)

		return Memory if index == None else Memory[index]

	def getNetworkInterfaceCard(self, setEnable=True, index=None):
		'''
		Method: Return List or Dict
		Command: wmic nic where NetEnabled=true list /format:rawxml
		Parameter: setEnable=True -->> Default
		
		Description:
			-> WMIC().getNetworkInterfaceCard() return list() data inside of dict()
			-> Get an Information from Network Card
			-> WMIC().getNetworkInterfaceCard(index=0) or WMIC().getNetworkInterfaceCard()[0] return dict()
		'''
		NIC = []
		root =  None 

		if setEnable is True: root = ET.fromstring(str(subprocess.Popen("wmic nic where NetEnabled=true list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))
		else: root = ET.fromstring(str(subprocess.Popen("wmic nic list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0]:
			_NIC = {}

			for b in a:
				for c in b: _NIC[b.attrib['NAME'].lower()] = c.text

			NIC.append(_NIC)

		return NIC if index == None else NIC[index]

	def getStorage(self, index=None):
		'''
		Method: Return List
		Command: wmic diskdrive list /format:rawxml
		
		Description:
			-> WMIC().getStorage() return list() data inside of dict()
			-> Get an Information from Storage Drive Device Card
			-> WMIC().getStorage(index=0) or WMIC().getStorage()[0] return dict()
		'''
		Storage = []
		root = ET.fromstring(str(subprocess.Popen("wmic diskdrive list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0]:
			_Storage = {}

			for b in a:
				for c in b: _Storage[b.attrib['NAME'].lower()] = c.text

			Storage.append(_Storage)

		return Storage if index == None else Storage[index]

	def getDesktopMonitor(self, index=None):
		'''
		Method: Return List
		Command: wmic desktopmonitor list /format:rawxml
		
		Description:
			-> WMIC().getDesktopMonitor() return list() data inside of dict()
			-> Get an Information from Monitor
			-> WMIC().getDesktopMonitor(index=0) or WMIC().getDesktopMonitor()[0] return dict()
		'''
		DesktopMonitor = []
		root = ET.fromstring(str(subprocess.Popen("wmic desktopmonitor list /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0]:
			_DesktopMonitor = {}

			for b in a:
				for c in b: _DesktopMonitor[b.attrib['NAME'].lower()] = c.text

			DesktopMonitor.append(_DesktopMonitor)

		return DesktopMonitor if index == None else DesktopMonitor[index]

	def getOperatingSystem(self, index=''):
		'''
		Method: Return Dictionary
		Command: wmic os list /format:rawxml
		
		Description:
			-> WMIC().getDesktopMonitor() return list() data inside of dict()
			-> Get an OS Information
			-> WMIC().getOperatingSystem()['key'] or WMIC().getOperatingSystem(index='key') return dict()
		'''
		OS = {}
		root = ET.fromstring(str(subprocess.Popen("wmic os list brief /format:rawxml", startupinfo=self.startupinfo, stdout=subprocess.PIPE).stdout.read().decode("utf-8")).replace("\r", "").replace("\n", "").replace("\t", ""))

		for a in root[1][0][0]:
			for b in a:
				OS[a.attrib['NAME'].lower()] = b.text

		return OS if index == '' else OS[index]

	def getComputerName(self):
		'''
		Method: Return String
		
		Description:
			-> Return Computer | PC Name
		'''
		return os.environ['COMPUTERNAME']

	def getComputerUsername(self):
		'''
		Method: Return String

		Description:
			-> Return User Name in the Computer | PC
		'''
		return os.environ['USERNAME']

	# Checking if this is running on Windows OS only
	def checkWindowsOS(self): return True if sys.platform == "win32" else False
