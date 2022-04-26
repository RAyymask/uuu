import Vue from 'vue'
import router from './router'
import axios from 'axios'
import utils from '@/utils/utils'

Vue.prototype.$http = axios
axios.defaults.baseURL = '/api'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  // 登录
  login (username, password) {
    return ajax('login', 'post', {
      data: {
        username,
        password
      }
    })
  },
  logout () {
    return ajax('logout', 'get')
  },
  getProfile () {
    return ajax('profile', 'get')
  },
  // 获取公告列表
  getAnnouncementList (offset, limit) {
    return ajax('admin/announcement', 'get', {
      params: {
        paging: true,
        offset,
        limit
      }
    })
  },
  // 删除公告
  deleteAnnouncement (id) {
    return ajax('admin/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  // 修改公告
  updateAnnouncement (data) {
    return ajax('admin/announcement', 'put', {
      data
    })
  },
  // 添加公告
  createAnnouncement (data) {
    return ajax('admin/announcement', 'post', {
      data
    })
  },
  // 获取用户列表
  getUserList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/user', 'get', {
      params: params
    })
  },
  // 获取单个用户信息
  getUser (id) {
    return ajax('admin/user', 'get', {
      params: {
        id
      }
    })
  },
  // 编辑用户
  editUser (data) {
    return ajax('admin/user', 'put', {
      data
    })
  },
  deleteUsers (id) {
    return ajax('admin/user', 'delete', {
      params: {
        id
      }
    })
  },
  importUsers (users) {
    return ajax('admin/user', 'post', {
      data: {
        users
      }
    })
  },
  generateUser (data) {
    return ajax('admin/generate_user', 'post', {
      data
    })
  },
  getLanguages () {
    return ajax('languages', 'get')
  },
  getSMTPConfig () {
    return ajax('admin/smtp', 'get')
  },
  createSMTPConfig (data) {
    return ajax('admin/smtp', 'post', {
      data
    })
  },
  editSMTPConfig (data) {
    return ajax('admin/smtp', 'put', {
      data
    })
  },
  testSMTPConfig (email) {
    return ajax('admin/smtp_test', 'post', {
      data: {
        email
      }
    })
  },
  getWebsiteConfig () {
    return ajax('admin/website', 'get')
  },
  editWebsiteConfig (data) {
    return ajax('admin/website', 'post', {
      data
    })
  },
  getJudgeServer () {
    return ajax('admin/judge_server', 'get')
  },
  deleteJudgeServer (hostname) {
    return ajax('admin/judge_server', 'delete', {
      params: {
        hostname: hostname
      }
    })
  },
  updateJudgeServer (data) {
    return ajax('admin/judge_server', 'put', {
      data
    })
  },
  getInvalidTestCaseList () {
    return ajax('admin/prune_test_case', 'get')
  },
  pruneTestCase (id) {
    return ajax('admin/prune_test_case', 'delete', {
      params: {
        id
      }
    })
  },
  createContest (data) {
    return ajax('admin/contest', 'post', {
      data
    })
  },
  getContest (id) {
    return ajax('admin/contest', 'get', {
      params: {
        id
      }
    })
  },
  editContest (data) {
    return ajax('admin/contest', 'put', {
      data
    })
  },
  getContestList (offset, limit, keyword) {
    let params = {paging: true, offset, limit}
    if (keyword) {
      params.keyword = keyword
    }
    return ajax('admin/contest', 'get', {
      params: params
    })
  },
  getContestAnnouncementList (contestID) {
    return ajax('admin/contest/announcement', 'get', {
      params: {
        contest_id: contestID
      }
    })
  },
  createContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'post', {
      data
    })
  },
  deleteContestAnnouncement (id) {
    return ajax('admin/contest/announcement', 'delete', {
      params: {
        id
      }
    })
  },
  updateContestAnnouncement (data) {
    return ajax('admin/contest/announcement', 'put', {
      data
    })
  },
  getProblemTagList (params) {
    return ajax('problem/tags', 'get', {
      params
    })
  },
  compileSPJ (data) {
    return ajax('admin/compile_spj', 'post', {
      data
    })
  },
  createProblem (data) {
    return ajax('admin/problem', 'post', {
      data
    })
  },
  editProblem (data) {
    return ajax('admin/problem', 'put', {
      data
    })
  },
  deleteProblem (id) {
    return ajax('admin/problem', 'delete', {
      params: {
        id
      }
    })
  },
  getProblem (id) {
    return ajax('admin/problem', 'get', {
      params: {
        id
      }
    })
  },
  getProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('admin/problem', 'get', {
      params
    })
  },
  getContestProblemList (params) {
    params = utils.filterEmptyValue(params)
    return ajax('admin/contest/problem', 'get', {
      params
    })
  },
  getContestProblem (id) {
    return ajax('admin/contest/problem', 'get', {
      params: {
        id
      }
    })
  },
  createContestProblem (data) {
    return ajax('admin/contest/problem', 'post', {
      data
    })
  },
  editContestProblem (data) {
    return ajax('admin/contest/problem', 'put', {
      data
    })
  },
  deleteContestProblem (id) {
    return ajax('admin/contest/problem', 'delete', {
      params: {
        id
      }
    })
  },
  makeContestProblemPublic (data) {
    return ajax('admin/contest_problem/make_public', 'post', {
      data
    })
  },
  addProblemFromPublic (data) {
    return ajax('admin/contest/add_problem_from_public', 'post', {
      data
    })
  },
  getReleaseNotes () {
    return ajax('admin/versions', 'get')
  },
  getDashboardInfo () {
    return ajax('admin/dashboard_info', 'get')
  },
  getSessions () {
    return ajax('sessions', 'get')
  },
  exportProblems (data) {
    return ajax('export_problem', 'post', {
      data
    })
  },
  getcrawler (ojname, problemid) {
    return ajax('crawler/problem', 'get', {
      params: {
        oj_name: ojname,
        problem_id: problemid
      }
    })
  },
  getClassesList () {
    return ajax('classes', 'get')
  },
  getClassesMembers (classid) {
    return ajax('classStudentData', 'get', {
      params: {
        class_id: classid
      }
    })
  },
  StudentQuitClass (ID) {
    // 学生退出某个班级
    return ajax('classStudentData', 'delete', {
      params: {
        id: ID
      }
    })
  },
  StudentJoinClass (classid, stuid) {
    // 学生加入某个班级
    return ajax('classStudentData', 'post', {
      data: {
        class_id: classid,
        student_id: stuid
      }
    })
  },
  CreateClass (classname, invitationnumber) {
    // 创建班级
    return ajax('admin/classes', 'post', {
      data: {
        class_name: classname,
        invitation_number: invitationnumber
      }
    })
  },
  DeleteClass (classid) {
    return ajax('admin/classes', 'delete', {
      params: {
        id: classid
      }
    })
  },
  ModifyClass (classid, classname, invitationnumber) {
    return ajax('admin/classes', 'put', {
      data: {
        id: classid,
        class_name: classname,
        invitation_number: invitationnumber
      }
    })
  },
  getClassHomeworkList (classid) {
    return ajax('admin/classes/contest', 'get', {
      params: {
        class_id: classid
      }
    })
  },
  AddHomeworkToClass (contestid, classid, displayid) {
    return ajax('admin/classes/add_contest', 'post', {
      data: {
        contest_id: contestid,
        class_id: classid,
        display_id: displayid
      }
    })
  },
  getHomeworkScore (classid) {
    return ajax('classes/source', 'get', {
      params: {
        class_id: classid
      }
    })
  }
}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */
function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}} = options
  } else {
    params = data = {}
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.error !== null) {
        Vue.prototype.$error(res.data.data)
        reject(res)
        // // 若后端返回为登录，则为session失效，应退出当前登录用户
        if (res.data.data.startsWith('Please login')) {
          router.push({name: 'login'})
        }
      } else {
        resolve(res)
        if (method !== 'get') {
          Vue.prototype.$success('Succeeded')
        }
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      reject(res)
      Vue.prototype.$error(res.data.data)
    })
  })
}
