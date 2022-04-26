
<template>
  <el-tabs v-model="activeName"
           type="border-card">
    <el-tab-pane label="我的班级"
                 name="MyClass">
      <template>
        <el-table :data="tableData2"
                  style="width: 100%">
          <el-table-column prop="className"
                           label="班级"
                           width="400"
                           align="center">
          </el-table-column>
          <el-table-column label="作业"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         round
                         @click="homework(scope.row)">作业
              </el-button>
            </template>
            </el-table-column>
          <el-table-column label="退出"
                           align="center"
                           min-width="200">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         round
                         @click="QuitClick(scope.row)">退出
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-tab-pane>

        <el-tab-pane label="加入班级"
                 name="JoinClass">
      <template>
        <el-table :data="tableData"
                  style="width: 100%"
                  :inline="true">
          <el-table-column prop="className"
                           label="班级"
                           width="200"
                           align="center">
          </el-table-column>
          <el-table-column prop="classSize"
                           label="人数"
                           width="100"
                           align="center">
          </el-table-column>
          <el-table-column prop="creator"
                           label="创建者"
                           width="100"
                           align="center">
          </el-table-column>
          <el-table-column prop="create_time"
                           label="创建时间"
                           width="200"
                           align="center">
          </el-table-column>
          <el-table-column prop="password" label="密码" width="200" align="center">
            <template inline-template slot-scope="scope">
              <el-input v-model="scope.row.password" style="width: 100%" placeholder="请输入密码" type="password" @input="change($event)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center"
                           min-width="200"
                           :inline="true">
            <template slot-scope="scope">
              <el-button type="primary" size="small" round @click="JoinClick(scope.row)">加入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </el-tab-pane>
  </el-tabs>
</template>

<script>
import api from '@oj/api'
import {mapActions} from 'vuex'
export default {
  name: 'UserClass',
  data () {
    return {
      activeName: 'MyClass',
      classesid: {},
      tableData: [],
      tableData2: [],
      deleteId: {},
      classesid2: {},
      classId: '',
      password: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions['getProfile'],
    init () {
      // let route = this.$route.query
      // console.log(route)
      this.getClassList()
      this.getMyClass()
    },
    getClassList () {
      api.getClassesList().then(res => {
        this.tableData = res.data.data
        // console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          this.tableData[i].className = res.data.data[i].class_name
          this.tableData[i].classSize = res.data.data[i].total_number
          this.tableData[i].creator = res.data.data[i].creator
          this.tableData[i].create_time = res.data.data[i].create_time.slice(0, 10)
          this.classesid[res.data.data[i].class_name] = res.data.data[i].id
        }
      }).catch(() => {
      })
    },
    getMyClass () {
      let stuid = this.$store.getters.user.id
      if (stuid !== undefined) {
        api.getStudentClasses(stuid).then(res => {
          this.tableData2 = res.data.data
          // console.log(res)
          for (var i = 0; i < res.data.data.length; i++) {
            this.tableData2[i].className = res.data.data[i].class_name
            this.deleteId[res.data.data[i].class_name] = res.data.data[i].id
            this.classesid2[res.data.data[i].class_name] = res.data.data[i].class_id
          }
        }).catch(() => {
        })
      }
    },
    homework (row) {
      this.$router.push({name: 'homework-list', params: {classid: this.classesid2[row.className]}})
    },
    JoinClick (row) {
      let stuid = this.$store.getters.user.id
      let classid = this.classesid[row.className]
      let pwd = row.password
      // console.log(this.password)
      api.StudentJoinClass(classid, stuid, pwd).then(res => {
        // console.log(res)
        if (res.statusText === 'OK') {
          this.$success('Success')
          this.init()
          row.password = ''
          this.activeName = 'MyClass'
        }
        // this.init()
      }).catch(() => {
        row.password = ''
      })
    },
    QuitClick (row) {
      let deleteid = this.deleteId[row.className]
      api.StudentQuitClass(deleteid).then(res => {
        if (res.statusText === 'OK') {
          this.$success('Success')
          this.init()
        }
      }).catch(() => {
      })
    },
    change (e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
h1 {
  position: relative;
}
</style>
