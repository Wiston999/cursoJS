#!/usr/bin/env python

import urllib2, urllib
import json
import os

def SendRequest(url, method):
	data = None
	if method.lower() in ['put', 'post', 'get', 'delete']:
		opener = urllib2.build_opener(urllib2.HTTPHandler)
		request = urllib2.Request('http://proyecto-cursojsasdfasdf.rhcloud.com/%s'%(url))
		request.get_method = lambda: method
		data = json.loads(opener.open(request).read())
	return data
	
def ProcessResponse(response):
	correct = False
	if response['status'] == 'error':
		print '%sResponse error: %s%s' %('\033[31;01m' if os.name=='posix' else '', response['description'], '\033[0m' if os.name=='posix' else '')
		correct = False
	elif response['status'] == 'success':
		print '%sResponse success: %s%s' %('\033[32;01m' if os.name=='posix' else '', response['description'], '\033[0m' if os.name=='posix' else '')
		correct = True
	return correct
	
if __name__ == '__main__':
	end = False
	logingName = raw_input('Enter your login name: ')
	response = SendRequest(logingName.strip(), 'PUT')
	
	while not ProcessResponse(response):
		logingName = raw_input('Enter another login name: ')
		response = SendRequest(logingName.strip(), 'PUT')
	
	while not end:
		try:
			command = raw_input('> ')
		
			if command.lower().startswith('post'):
				response = SendRequest("%s/%s/%s"%(urllib.quote(logingName), urllib.quote(command.split('##')[-2]), urllib.quote(command.split('##')[-1])), 'POST')
				ProcessResponse(response)
				
			elif command.lower().startswith('users'):
				response = SendRequest("%s/users"%(urllib.quote(logingName)), 'GET')
				if ProcessResponse(response):
					if len(response['users']) > 0:
						print "Users currently online:"
						for user in response['users']:
							print user if user != logingName else "%s (Me)"%(user)
					else:
						print "There is not users online"
						
			elif command.lower().startswith('search'):
				response = SendRequest("%s/search/%s"%(urllib.quote(logingName), urllib.quote(command.split('##')[-1])), 'GET')
				if ProcessResponse(response):
					if len(response['comments']) > 0:
						for i, comment in enumerate(response['comments']):
							print "%d: %s\n\t%s\n\tFrom: %s" %(i, comment['title'], comment['content'], comment['author'])
					else:
						print "There is no comments"
						
			elif command.lower().startswith('usercomments'):
				response = SendRequest('%s/%s'%(urllib.quote(logingName), command.split('##')[-1]), 'GET')
				if ProcessResponse(response):
					if len(response['comments']) > 0:
						print "Comments from user %s:" %(command.split('##')[-1])
						for i, comment in enumerate(response['comments']):
							print "%d: %s\n\t%s" %(i, comment['title'], comment['content'])
					else:
						print "There is no comments"
			elif command.lower().startswith('help'):
				print "Help:"
				print "\tCommand Format: commandName##[parameters]"
				print "Commands:"
				print "\tPost: Post a comment, parameters: title##commentContent"
				print "\tSearch: Search a word inside comments, parameters: searchTerm"
				print "\tUserComments: Get comments from certain user, parameters: userName"
				print "\tUsers: Get users currently online"
				print "\tQuit: Closes the client"
				print "\tHelp: Prints this help"
				
			elif command.lower().startswith('quit'):
				end = True
		except Exception as e:
			print "Some error occurred. Exiting..."
			
	response = SendRequest(urllib.quote(logingName).strip(), 'DELETE')
	ProcessResponse(response)
	print "Bye."