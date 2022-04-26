<template>
  <div class="view">
    <Panel title="Classes List">
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
        :data="classList"
        style="width: 100%">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <p>Create Time: {{props.row.create_time | localtime}}</p>
            <p>Creator: {{props.row.created_by.username}}</p>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="id"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="class_name"
          width="200"
          label="class_name">
        </el-table-column>
        <el-table-column
          prop="total_number"
          label="total_number"
          width="130">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="creator"
          width="180">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="create_time">
        </el-table-column>
        <!-- <el-table-column
          width="100"
          label="Visible">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.visible"
                       active-text=""
                       inactive-text=""
                       @change="handleVisibleSwitch(scope.row)">
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn name="Members" icon="list-ol" @click.native="goClassMemberList(scope.row.id)"></icon-btn>
            <icon-btn name="Homework" icon="info-circle" @click.native="goHomeworkList(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Score" @click.native="goClassScore(scope.row.id)"></icon-btn>
            <icon-btn icon="trash" name="Delete Class" @click.native="deleteClass(scope.row.id)"></icon-btn>
            <!-- <icon-btn icon="download" name="Download Accepted Submissions"
                      @click.native="openDownloadOptions(scope.row.id)"></icon-btn> -->
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Download Contest Submissions"
               width="30%"
               :visible.sync="downloadDialogVisible">
      <el-switch v-model="excludeAdmin" active-text="Exclude admin submissions"></el-switch>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadSubmissions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import {CONTEST_STATUS_REVERSE} from '@/utils/constants'

  export default {
    name: 'ClassList',
    data () {
      return {
        pageSize: 10,
        total: 0,
        contestList: [],
        classList: [],
        keyword: '',
        loading: false,
        excludeAdmin: true,
        currentPage: 1,
        currentId: 1,
        downloadDialogVisible: false,
        classId: ''
      }
    },
    mounted () {
      // this.getContestList(this.currentPage)
      this.getClassList()
    },
    filters: {
      contestStatus (value) {
        return CONTEST_STATUS_REVERSE[value].name
      }
    },
    methods: {
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getContestList(page)
      },
      getContestList (page) {
        this.loading = true
        api.getContestList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contestList = res.data.data.results
          // console.log(123123123)
          // console.log(this.contestList)
        }, res => {
          this.loading = false
        })
      },
      getClassList () {
        api.getClassesList().then(res => {
          this.classList = res.data.data
          // console.log(res)
          for (var i = 0; i < res.data.data.length; i++) {
            // this.tableData[i].className = res.data.data[i].class_name
            // this.tableData[i].classSize = res.data.data[i].total_number
            // this.tableData[i].creator = res.data.data[i].creator
            this.classList[i].create_time = res.data.data[i].create_time.slice(0, 10)
            // this.classesid[res.data.data[i].class_name] = res.data.data[i].id
          }
          this.classId = this.classList[0].id
          console.log(this.classList)
        }).catch(() => {
        })
      },
      deleteClass (id) {
        this.$confirm('Sure to delete this class?', 'Delete Class', {
          type: 'warning'
        }).then(() => {
          api.DeleteClass(id).then(res => {
            if (res.statusText === 'OK') {
              this.$success('Success')
            }
            this.getClassList()
          }).catch(() => {
          })
        }, () => {
        })
      },
      openDownloadOptions (contestId) {
        this.downloadDialogVisible = true
        this.currentId = contestId
      },
      downloadSubmissions () {
        let excludeAdmin = this.excludeAdmin ? '1' : '0'
        let url = `/admin/download_submissions?contest_id=${this.currentId}&exclude_admin=${excludeAdmin}`
        utils.downloadFile(url)
      },
      goEdit (classId) {
        this.$router.push({name: 'edit-class', params: {classId}})
      },
      goContestAnnouncement (contestId) {
        this.$router.push({name: 'contest-announcement', params: {contestId}})
      },
      goHomeworkList (classId) {
        this.$router.push({name: 'class-homeworklist', params: {classId}})
      },
      goClassMemberList (classId) {
        this.$router.push({name: 'class-members-list', params: {classId}})
      },
      handleVisibleSwitch (row) {
        api.editContest(row)
      },
      goClassScore (classId) {
        this.$router.push({name: 'class-score-list', params: {classId}})
      },
      getScoreList (classesid) {
        api.getHomeworkScore(classesid).then(res => {
          console.log(res)
        }).catch(() => {
        })
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      }
    }
  }
</script>
