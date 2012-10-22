if (typeof Wiz === 'undefined') {
	'use strict';
	var Wiz = {
		_notification: null,
		_context: null,
		_storageManager: null
	};

	Wiz.getNotification = function () {
		if (this._notification === null) {
			this._notification = new Wiz.Notification();
		}
		return this._notification;
	};

	Wiz.getContext = function () {
		if (this._context === null) {
			this._context = new Wiz.Context();
		}
		return this._context;
	};

	Wiz.setContext = function (context) {
		if (context instanceof Wiz.Context) {
			this._context = context;
		}
	};
	Wiz.getStorageManager = function () {
		if (this._storageManager === null) {
			this._storageManager = new Wiz.StorageManager();
		}
		return this._storageManager;
	};

}
Wiz.__defineGetter__('notification', Wiz.getNotification);
Wiz.__defineGetter__('context', Wiz.getContext);
Wiz.__defineSetter__('context', Wiz.setContext);
Wiz.__defineGetter__('storageManager', Wiz.getStorageManager);