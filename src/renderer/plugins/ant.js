import Vue from 'vue'

import 'ant-design-vue/lib/avatar/style/css';
import 'ant-design-vue/lib/badge/style/css';
import 'ant-design-vue/lib/checkbox/style/css';
import 'ant-design-vue/lib/modal/style/css';
import 'ant-design-vue/lib/message/style/css';
import 'ant-design-vue/lib/date-picker/style/css';
import 'ant-design-vue/lib/popconfirm/style/css';
import 'ant-design-vue/lib/switch/style/css';
// import 'ant-design-vue/lib/icon/style/css';
import 'ant-design-vue/lib/notification/style/css';
import 'ant-design-vue/lib/select/style/css';
import 'ant-design-vue/lib/auto-complete/style/css';
import 'ant-design-vue/lib/input-number/style/css';
import 'ant-design-vue/lib/tooltip/style/css';

import {Avatar, Badge, Checkbox, AutoComplete, InputNumber, Select, DatePicker, message, Popconfirm, Switch, Modal, notification, Tooltip} from 'ant-design-vue';


// Vue.use(Icon)
Vue.use(Badge)
Vue.use(Avatar)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(AutoComplete)
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$confirm = Modal.confirm;
Vue.use(Popconfirm)
Vue.use(notification)
Vue.use(Modal)
Vue.use(InputNumber)
Vue.use(Tooltip)
