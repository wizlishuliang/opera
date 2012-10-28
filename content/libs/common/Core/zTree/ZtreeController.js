/**
 * @author rechie
 */
function ZtreeController() {
	'use strict';
	var setting = {
		view : {
			dblClickExpand : false,
			showLine : true,
			selectedMulti : false,
			showIcon : true
		},
		data : {
			simpleData : {
				enable : false
			}
		},
		callback : {
			onClick : zTreeOnClick
		}

	},
		zNodesObj;

	function zTreeOnClick(event, treeId, treeNode) {
		var nodeLocation = treeNode.location,
			displayLocation = treeNode.displayLocation;
		$('#category_info').attr('location', nodeLocation);
		PopupView.hideCategoryTreeAfterSelect(displayLocation, 500);

		//把最后一次选择的文件夹保存起来，下次使用
		localStorage['last-category'] = displayLocation + '*' + nodeLocation;
	}

	/**
	 * 将获取到的json object处理成ztree需要的格式
	 * @param {Object} obj
	 */
	function parseDate(obj) {
		//用来存放 category-name的map
		var categoryMap = new HashMap(),
			locationArray = obj.split('*'),
			//数组下标
			index = 0,
			ztreeData = [],
			tempLocation,
			locationLength,
			//解析后单个文件夹的名称数组
			nameArr,
			//当前文件夹的父路径
			parentLocation,
			//存放在HashMap中的nodeData，防止重复
			mapNodeObj,
			//每个节点的数据
			nodeObj,
			//父节点
			parentNode,
			//当前文件夹父节点的子节点数
			childCount;

		$.each(locationArray, function (firstIndex, location) {
			tempLocation = '/';
			locationLength = location.length;
			//把头尾的空串去掉
			nameArr = location.substr(1, locationLength - 2).split('/');
			$.each(nameArr, function (levelIndex, name) {
				//记录路径
				parentLocation = tempLocation;
				tempLocation += name + '/';
				mapNodeObj = categoryMap.get(tempLocation);
				if (!mapNodeObj) {
					//根节点特殊处理
					nodeObj = {
						name : changeSpecilaLoction(name),
						displayLocation : changeSpecilaLoction(tempLocation),
						location : tempLocation,
						level : levelIndex
					};
					categoryMap.put(tempLocation, nodeObj);
					//非根节点
					if (levelIndex === 0) {
						ztreeData[index] = nodeObj;
						index++;
					}
					parentNode = categoryMap.get(parentLocation);
					if (parentNode) {
						parentNode.children = parentNode.children || [];
						childCount = parentNode.children.length;
						parentNode.children[childCount] = nodeObj;
					}
				}
			});
		});
		return ztreeData;
	}

	function setNodes(data) {
		zNodesObj = data;
	}

	function initTree(id) {
		console.debug(JSON.stringify(zNodesObj));
		$.fn.zTree.init($('#' + id), setting, zNodesObj);
	}
	this.initTree = initTree;
	this.setNodes = setNodes;
	this.parseDate = parseDate;
}

var specialLocation = {
	'My Notes' : operaI18N.getMessage('MyNotes'),
	'My Mobiles' : operaI18N.getMessage('MyMobiles'),
	'My Drafts' : operaI18N.getMessage('MyDrafts'),
	'My Journals' : operaI18N.getMessage('MyJournals'),
	'My Events' : operaI18N.getMessage('MyEvents'),
	'My Contacts' : operaI18N.getMessage('MyContacts'),
	'My Tasks' : operaI18N.getMessage('MyTasks'),
	'Deleted Items' : operaI18N.getMessage('DeletedItems'),
	'My Sticky Notes' : operaI18N.getMessage('MyStickyNotes'),
	'Inbox' : operaI18N.getMessage('Inbox'),
	'Completed' : operaI18N.getMessage('Completed'),
	'My Photos' : operaI18N.getMessage('MyPhotos'),
	'My Emails' : operaI18N.getMessage('MyEmails')
}

/**
 * 对特殊的文件夹处理，返回相应的显示名
 */
function changeSpecilaLoction(location) {
	'use strict' ;
	$.each(specialLocation, function (key, value) {
		var index = location.indexOf(key);

		if (index === 0 && location === key) {
			location = value;
			return false;
		}
		if (index === 1 && location.indexOf('/') === 0) {
			location = '/' + value + location.substr(key.length + 1);
			return false;
		}
	});
	return location;
}
