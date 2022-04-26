<template>
  <div class="view">
    <Panel :title="this.$i18n.t('m.Class_Score')">
      <div slot="header">
        <!-- <el-button type="primary" round size="small" icon="download" @click="handleDownloadData()">导出</el-button> -->
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table :data="scoreList" border>                
	      <el-table-column :label="val" v-for="(val, i) in titledata" :key="i">                  				
	        <template slot-scope="scope">{{scoreList[scope.$index][i]}}</template>                
	      </el-table-column>              
      </el-table>
      <div class="panel-options">
        <el-button type="primary" round size="small" icon="download" @click="handleDownloadData()">导出</el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddStudent from './AddStudent.vue'
  export default {
    name: 'ClassMemberList',
    components: {
      // AddProblemComponent
      'add-student-component': AddStudent
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        problemList: [],
        memberList: [],
        scoreList: [],
        // subscorelist: [],
        homeworklistlength: 0,
        titledata: ['stu_realname', 'stu_number'],
        titledata1: [],
        titledata2: [],
        totlist: [],
        homeworklist: [],
        keyword: '',
        loading: false,
        currentPage: 1,
        routeName: '',
        contestId: '',
        classId: '',
        // for make public use
        currentProblemID: '',
        currentRow: {},
        InlineEditDialogVisible: false,
        makePublicDialogVisible: false,
        addProblemDialogVisible: false
      }
    },
    mounted () {
      this.routeName = this.$route.name
      this.classId = this.$route.params.classId
      // console.log(this.routeName, this.classId)
      // this.getProblemList(this.currentPage)
      // this.getClassesMembersList()
      this.getScoreList()
      this.getHomeworkList()
      this.getHomeworkNumber()
    },
    methods: {
      handleDblclick (row) {
        row.isEditing = true
      },
      goEdit (problemId) {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'edit-problem', params: {problemId}})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'edit-contest-problem', params: {problemId: problemId, contestId: this.contestId}})
        }
      },
      goCreateProblem () {
        if (this.routeName === 'problem-list') {
          this.$router.push({name: 'create-problem'})
        } else if (this.routeName === 'contest-problem-list') {
          this.$router.push({name: 'create-contest-problem', params: {contestId: this.contestId}})
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getProblemList(page)
      },
      getClassesMembersList () {
        this.loading = true
        api.getClassesMembers(this.classId).then(res => {
          this.loading = false
          this.memberList = res.data.data
        }).catch(() => {
          this.loading = false
        })
      },
      getScoreList () {
        setTimeout(() => {
          this.loading = true
          api.getHomeworkScore(this.classId).then(res => {
            this.loading = false
            // this.scoreList = res.data.data.source
            console.log(res)
            // var subscorelist = []
            for (let i = 0; i < res.data.data.source.length; i++) {
              let subscorelist = []
              subscorelist.push(res.data.data.source[i].student_username)
              subscorelist.push(res.data.data.source[i].student_number)
              for (let j = 0; j < this.homeworklistlength + 1; j++) {
                subscorelist.push(0)
              }
              if (res.data.data.source[i].contest.length !== 0) {
                let num = 0
                for (let j = 0; j < res.data.data.source[i].contest.length; j++) {
                  num += res.data.data.source[i].contest[j].accepted_number
                  for (let k = 0; k < this.homeworklistlength; k++) {
                    if (this.homeworklist[k] === res.data.data.source[i].contest[j].contest_id) {
                      subscorelist[k + 2] = res.data.data.source[i].contest[j].accepted_number
                      break
                    }
                  }
                }
                subscorelist[this.homeworklistlength + 2] = num
              }
              console.log('qqqqqqqq')
              console.log(subscorelist)
              this.scoreList.push(subscorelist)
            }
          }).catch(() => {
            this.loading = false
          })
        }, 1500)
        setTimeout(() => {
          console.log('123123123123123123')
          console.log(this.scoreList)
        }, 2500)
      },
      getHomeworkList () {
        api.getClassHomeworkList(this.classId).then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.titledata1.push('Contest_' + res.data.data[i].id.toString())
            this.homeworklist.push(res.data.data[i].id)
          }
        }).catch(() => {
        })
      },
      getHomeworkNumber () {
        setTimeout(() => {
          this.homeworklistlength = this.homeworklist.length
          console.log(this.homeworklistlength, 'aaaaa')
          let params = {
            limit: this.pageSize,
            offset: (this.currentPage - 1) * this.pageSize,
            keyword: '',
            contest_id: ''
          }
          for (var i = 0; i < this.homeworklistlength; i++) {
            params.contest_id = this.homeworklist[i]
            api.getContestProblemList(params).then(res => {
              this.titledata2.push('(' + res.data.data.total.toString() + ')')
            }).catch(() => {
            })
          }
          // for (var j = 0; j < this.homeworklistlength; j++) {
          //   console.log(this.titledata1[j])
          //   console.log(this.titledata2[j])
          //   this.titledata.push(this.titledata1[j] + this.titledata2[j])
          // }
        }, 500)
        setTimeout(() => {
          for (var j = 0; j < this.homeworklistlength; j++) {
            // console.log(this.titledata1[j])
            // console.log(this.titledata2[j])
            this.titledata.push(this.titledata1[j] + this.titledata2[j])
          }
          this.titledata.push('tot_ac_number')
          console.log(this.titledata)
        }, 1000)
      },
      getProblemList (page = 1) {
        this.loading = true
        let funcName = this.routeName === 'problem-list' ? 'getProblemList' : 'getContestProblemList'
        let params = {
          limit: this.pageSize,
          offset: (page - 1) * this.pageSize,
          keyword: this.keyword,
          contest_id: this.contestId
        }
        api[funcName](params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          for (let problem of res.data.data.results) {
            problem.isEditing = false
          }
          this.problemList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      deleteStudent (id) {
        this.$confirm('Sure to delete this student from current class?', 'Delete Student', {
          type: 'warning'
        }).then(() => {
          api.StudentQuitClass(id).then(res => {
            if (res.statusText === 'OK') {
              this.$success('Success')
              this.getClassesMembersList()
            }
            this.getClassesMembersList()
          }).catch(() => {
          })
        }, () => {
        })
      },
      makeContestProblemPublic (problemID) {
        this.$prompt('Please input display id for the public problem', 'confirm').then(({value}) => {
          api.makeContestProblemPublic({id: problemID, display_id: value}).catch()
        }, () => {
        })
      },
      updateProblem (row) {
        let data = Object.assign({}, row)
        let funcName = ''
        if (this.contestId) {
          data.contest_id = this.contestId
          funcName = 'editContestProblem'
        } else {
          funcName = 'editProblem'
        }
        api[funcName](data).then(res => {
          this.InlineEditDialogVisible = false
          this.getProblemList(this.currentPage)
        }).catch(() => {
          this.InlineEditDialogVisible = false
        })
      },
      handleInlineEdit (row) {
        this.currentRow = row
        this.InlineEditDialogVisible = true
      },
      downloadTestCase (problemID) {
        let url = '/admin/test_case?problem_id=' + problemID
        utils.downloadFile(url)
      },
      getPublicProblem () {
        api.getProblemList()
      },
      handleDownloadData () {
        // 导出表格的表头设置
        let allColumns = this.titledata
        let datalist = this.scoreList
        let datelist2 = []
        var columnNames = []
        var columnValues = []
        var tempdic = {}
        for (let i = 0; i < allColumns.length; i++) {
          columnNames[i] = allColumns[i]
          columnValues[i] = allColumns[i]
        }
        for (let i = 0; i < datalist.length; i++) {
          tempdic = {}
          for (let j = 0; j < allColumns.length; j++) {
            tempdic[allColumns[j]] = datalist[i][j]
          }
          datelist2.push(tempdic)
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = columnNames
          const filterVal = columnValues

          const list = datelist2
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, 'Class_' + this.classId + '_Score')
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    },
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.getProblemList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    }
  }
</script>

<style scoped lang="less">
</style>
