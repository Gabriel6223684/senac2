import { ipcMain, BrowserWindow } from 'electron';
import Template from '../mixin/Template.js';
import Customer from '../controller/Customer.js';
import Product from '../controller/Product.js';
import Supplier from '../controller/Supplier.js';
import Enterprise from '../controller/Enterprise.js';
import User from '../controller/User.js';

function getWin(event) {
    return BrowserWindow.fromWebContents(event.sender);
}

// Avisa todas as janelas para recarregar
function broadcastReload(channel) {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(channel);
    }
}

//  WINDOW
ipcMain.handle('window:open', (_e, name, opts = {}) => {
    const win = Template.create(name, opts);
    Template.loadView(win, name);
});

ipcMain.handle('window:openModal', (e, name, opts = {}) => {
    const parent = getWin(e);
    if (!parent) return;
    const win = Template.create(name, {
        width: 560,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: parent,
        modal: true,
        ...opts,
    });
    Template.loadView(win, name);
});

ipcMain.handle('window:close', (e) => {
    getWin(e)?.close();
});

//  TEMP STORE — dados temporários entre janelas
let tempData = {};

ipcMain.handle('temp:set', (_e, key, data) => {
    tempData[key] = data;
});

ipcMain.handle('temp:get', (_e, key) => {
    const data = tempData[key] || null;
    delete tempData[key];
    return data;
});

//  CUSTOMER
ipcMain.handle('customer:insert', async (_e, data) => {
    const result = await Customer.insert(data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:find', async (_e, where = {}) => {
    return await Customer.find(where);
});

ipcMain.handle('customer:findById', async (_e, id) => {
    return await Customer.findById(id);
});

ipcMain.handle('customer:update', async (_e, id, data) => {
    const result = await Customer.update(id, data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:delete', async (_e, id) => {
    const result = await Customer.delete(id);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

// Produtos
ipcMain.handle('product:find', async (_e, where = {}) => {
    return await Product.find(where);
});

ipcMain.handle('product:findById', async (_e, id) => {
    return await Product.findById(id);
});

ipcMain.handle('product:insert', async (_e, data) => {
    const result = await Product.insert(data);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:update', async (_e, id, data) => {
    const result = await Product.update(id, data);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:delete', async (_e, id) => {
    const result = await Product.delete(id);
    if (result.status) broadcastReload('product:reload');
    return result;
});

// Supplier
ipcMain.handle('supplier:find', async (_e, where = {}) => {
    return await Supplier.find(where);
});

ipcMain.handle('supplier:findById', async (_e, id) => {
    return await Supplier.findById(id);
});

ipcMain.handle('supplier:insert', async (_e, data) => {
    const result = await Supplier.insert(data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:update', async (_e, id, data) => {
    const result = await Supplier.update(id, data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:delete', async (_e, id) => {
    const result = await Supplier.delete(id);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

// Enterprise
ipcMain.handle('enterprise:find', async (_e, where = {}) => {
    return await Enterprise.find(where);
});

ipcMain.handle('enterprise:findById', async (_e, id) => {
    return await Enterprise.findById(id);
});

ipcMain.handle('enterprise:insert', async (_e, data) => {
    const result = await Enterprise.insert(data);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

ipcMain.handle('enterprise:update', async (_e, id, data) => {
    const result = await Enterprise.update(id, data);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

ipcMain.handle('enterprise:delete', async (_e, id) => {
    const result = await Enterprise.delete(id);
    if (result.status) broadcastReload('enterprise:reload');
    return result;
});

// User
ipcMain.handle('user:find', async (_e, where = {}) => {
    return await User.find(where);
});

ipcMain.handle('user:findById', async (_e, id) => {
    return await User.findById(id);
});

ipcMain.handle('user:insert', async (_e, data) => {
    const result = await User.insert(data);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('user:update', async (_e, id, data) => {
    const result = await User.update(id, data);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('user:delete', async (_e, id) => {
    const result = await User.delete(id);
    if (result.status) broadcastReload('user:reload');
    return result;
});
