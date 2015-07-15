#!/usr/bin/env node

var command = process.argv[2] || 'add';

var packageJson = require('../../package.json');

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function createAddRemoveStatement(plugin) {
    var pluginCmd = 'cordova plugin add ' + plugin + ' ';
    return pluginCmd;
}

function processPlugin(index) {
    if(index >= packageJson.cordovaPlugins.length)
        return;

    var plugin = packageJson.cordovaPlugins[index];
    var pluginCommand = createAddRemoveStatement(plugin);
    console.log(pluginCommand);
    exec(pluginCommand, function(){
        processPlugin(index + 1);
    });
}

processPlugin(0);