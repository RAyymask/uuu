<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="contestList" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="title"
        width="200"
        prop="title">
      </el-table-column>
      <el-table-column
        label="author"
        prop="created_by.username">
      </el-table-column>
      <el-table-column
        label="create_time"
        prop="create_time">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the homework"
                    @click.native="handleAddHomework(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicProblem"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-homework',
    props: ['classID'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        userList: [],
        contestList: [],
        contest: {},
        keyword: '',
        pageSize: 10,
        displayID: []
      }
    },
    mounted () {
      // api.getContest(this.contestID).then(res => {
      //   this.contest = res.data.data
      //   this.getPublicProblem()
      // }).catch(() => {
      // })
      this.getContestList(this.page)
    },
    methods: {
      // 获取用户列表
      getUserList (page) {
        this.loading = true
        api.getUserList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.userList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      getContestList (page) {
        this.loading = true
        api.getContestList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contestList = res.data.data.results
          console.log(res.data.data.results.length)
          for (var i = 0; i < res.data.data.results.length; i++) {
            this.contestList[i].create_time = this.contestList[i].create_time.slice(0, 10)
            this.displayID[this.contestList[i].id] = this.contestList[i]._id
            // console.log(this.contestList[i].create_time)
          }
          // console.log(res)
        }, res => {
          this.loading = false
        })
      },
      getPublicProblem (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit,
          rule_type: this.contest.rule_type
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddProblem (problemID) {
        this.$prompt('Please input display id for the contest problem', 'confirm').then(({value}) => {
          let data = {
            problem_id: problemID,
            contest_id: this.contestID,
            display_id: value
          }
          api.addProblemFromPublic(data).then(() => {
            this.$emit('on-change')
          }, () => {
          })
        }, () => {
        })
      },
      handleAddStudent (studentID) {
        api.StudentJoinClass(this.classID, studentID).then(res => {
          // console.log(res)
          if (res.statusText === 'OK') {
            this.$success('Success')
          }
        }).catch(() => {
        })
        this.getUserList(1)
      },
      handleAddHomework (contestid) {
        api.AddHomeworkToClass(contestid, this.classID, this.displayID[contestid]).then(res => {
          if (res.statusText === 'OK') {
            this.$success('Success')
          }
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPublicProblem(this.page)
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
