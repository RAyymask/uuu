<template>
  <div class="view">
    <Panel :title="this.$i18n.t('m.Member_List')">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="memberList"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          prop="student_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="student_username"
          label="username">
        </el-table-column>
        <el-table-column
          prop="student_realname"
          label="realname">
        </el-table-column>
        <!-- <el-table-column
          prop="created_by.username"
          label="Author">
        </el-table-column> -->
        <!-- <el-table-column
          width="200"
          prop="create_time"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time | localtime }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          width="100"
          prop="visible"
          label="Visible">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible"
                       active-text=""
                       inactive-text=""
                       @change="updateProblem(scope.row)">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="Operation"
          width="150">
          <div slot-scope="scope">
            <!-- <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn v-if="contestId" name="Make Public" icon="clone"
                      @click.native="makeContestProblemPublic(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn> -->
            <icon-btn icon="trash" name="Delete Student"
                      @click.native="deleteStudent(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <!-- <el-button type="primary" size="small"
                   @click="goCreateProblem" icon="el-icon-plus">Create
        </el-button> -->
        <el-button type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addProblemDialogVisible = true">Add From StudentList
        </el-button>
        <!-- <el-button type="primary"
                    size="small" icon="el-icon-refresh"
                    @click="getClassesMembersList">refresh
        </el-button> -->
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Sure to update the problem? "
               width="20%"
               :visible.sync="InlineEditDialogVisible"
               @close-on-click-modal="false">
      <div>
        <p>DisplayID: {{currentRow._id}}</p>
        <p>Title: {{currentRow.title}}</p>
      </div>
      <span slot="footer">
        <cancel @click.native="InlineEditDialogVisible = false; getProblemList(currentPage)"></cancel>
        <save @click.native="updateProblem(currentRow)"></save>
      </span>
    </el-dialog>
    <el-dialog title="Add Student to Current Class"
               width="80%"
               :visible.sync="addProblemDialogVisible"
               @close-on-click-modal="false">
      <add-student-component :classID="classId" @on-change="getClassesMembersList"></add-student-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddStudent from './AddStudent.vue'
  export default {
    name: 'ClassMemberList',
    components: {

      'add-student-component': AddStudent
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        problemList: [],
        memberList: [],
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
      this.getClassesMembersList()
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
          console.log(this.memberList)
        }).catch(() => {
          this.loading = false
        })
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
