
//一个action对应一个功能
import {
    LanguageAddDataAction, LanguageAddDataActionFailure, LanguageAddDataActionLoading,
    LanguageAddDataActionSuccess, LanguagedeleteDataAction, LanguagedeleteDataActionFailure,
    LanguagedeleteDataActionLoading,
    LanguagedeleteDataActionSuccess, LanguageEditDataAction,
    LanguageEditDataActionFailure,
    LanguageEditDataActionLoading,
    LanguageEditDataActionSuccess,
    LanguageGetDataAction, LanguageGetDataActionFailure, LanguageGetDataActionLoading, LanguageGetDataActionSuccess,
    LanguageMyButtonAction
} from "./LanguageAction";
import {url} from "../../../common/utils/urlconfig";
import {commonFetch, openNotification} from "../../common/commonFunction";
import { Modal } from 'antd';
const confirm = Modal.confirm;

export function executeLanguage(data, index, action){
    console.log("进入公共处理action","data",data,"index",index,"action",action);
    //这里是中转处理，各子系统有自己的编号，通过redix处理，这里处理异步的场景
    return dispatch => {
        if(action.type === LanguageGetDataAction.type){
            //加载用户数据
            console.log("加载用户数据");
            dispatch(commonFetch(url.index_language_getTableData_url,action.requestBody,LanguageGetDataActionLoading,LanguageGetDataActionSuccess,LanguageGetDataActionFailure));
        }
        else if(action.type === LanguagedeleteDataAction.type){
            //加载用户数据
            console.log("删除语言数据");
            dispatch(commonFetch(url.index_language_removeData_url,action.requestBody,LanguagedeleteDataActionLoading,LanguagedeleteDataActionSuccess,LanguagedeleteDataActionFailure));
        }
        else if(action.type === LanguageEditDataAction.type){
            //加载用户数据
            console.log("编辑语言数据");//到底是编辑还是添加交由后台去处理
            LanguageEditDataActionLoading.index = LanguageEditDataAction.index;
            LanguageEditDataActionLoading.operatetype = LanguageEditDataAction.operatetype;
            //对数据加工下,以供处理
            var json = {};
            const item = data[action.index];
            Object.keys(item).forEach((key) => {
                json[key] =  item[key].value;
            });
            dispatch(commonFetch(url.index_language_editData_url,json,LanguageEditDataActionLoading,LanguageEditDataActionSuccess,LanguageEditDataActionFailure));
        }
        else if(action.type === LanguageAddDataAction.type){
            //加载用户数据
            console.log("增加语言数据","action",action,"data",data,"index",index);//到底是编辑还是添加交由后台去处理
            var json = {};
            const item = data[action.index];
            Object.keys(item).forEach((key) => {
                    json[key] =  item[key].value;
            });
            if(typeof item.userLanguage.value === "undefined" || item.userLanguage.value === ""){
                openNotification("语言必填");
                return ;
            }else {
                 dispatch(commonFetch(url.index_language_addData_url,json,LanguageAddDataActionLoading,LanguageAddDataActionSuccess,LanguageAddDataActionFailure));
            }
        }
      /*  else if(action.type === LanguagedeleteDataAction.type){
            //加载用户数据
            console.log("删除语言数据","action",action,"data",data,"index",index);//到底是编辑还是添加交由后台去处理
            /!*            LanguageEditDataActionLoading.index = LanguageEditDataAction.index;
                        LanguageEditDataActionLoading.operatetype = LanguageEditDataAction.operatetype;*!/
            //对数据加工下,以供处理
            var json = {};
            const item = data[action.index];
            Object.keys(item).forEach((key) => {
                    json[key] =  item[key].value;
            });
            var id = item.key.value;
            if(id < 0){
                openNotification("该记录不可删除");
                return false;
            }else {
                dispatch(commonFetch(url.index_language_removeData_url,json,LanguagedeleteDataActionLoading,LanguagedeleteDataActionSuccess,LanguagedeleteDataActionFailure));
            }
        }*/
        else if(action.type === LanguageMyButtonAction.type){
            //加载用户数据
            console.log("删除语言数据","action",action,"data",data,"index",index);//到底是编辑还是添加交由后台去处理
            /*            LanguageEditDataActionLoading.index = LanguageEditDataAction.index;
                        LanguageEditDataActionLoading.operatetype = LanguageEditDataAction.operatetype;*/
            //对数据加工下,以供处理
            var json = {};
            json.ids = action.props.selectedRowKeys;
            console.log(json.ids);
            if(typeof json.ids === 'undefined' || json.ids.size === 0){
                openNotification("您未勾选");
                return ;
            }else {
                confirm({
                    title: '确认要批量删除吗?',
                    content: '批量删除后不可恢复',
                    onOk() {
                        dispatch(commonFetch(url.index_language_removeData_url,json,LanguagedeleteDataActionLoading,LanguagedeleteDataActionSuccess,LanguagedeleteDataActionFailure));
                       /* return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        }).catch(() => console.log('Oops errors!'));*/
                    },
                    onCancel() {},
                });
            }
        }
        else {
            //非异步场景直接交由redux处理
            action.data = data;
            action.index = index;
            //把参数扔进去
            dispatch(action);
        }
        console.log("公共处理action结束，交由redux处理");
    }
}