<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.Class_Name')" required>
              <el-input v-model="classes.class_name" :placeholder="$t('m.Class_Name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.invitation_number')" required>
              <el-input v-model="classes.invitation_number" :placeholder="$t('m.invitation_number')"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item :label="$t('m.Class_Name')" required>
              <el-input v-model="contest.title" :placeholder="$t('m.Class_Name')"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" required>
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" required>
              <el-date-picker
                v-model="contest.start_time"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" required>
              <el-date-picker
                v-model="contest.end_time"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Password')">
              <el-input v-model="contest.password" :placeholder="$t('m.Contest_Password')"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Rule_Type')">
              <el-radio class="radio" v-model="contest.rule_type" label="ACM" :disabled="disableRuleType">ACM</el-radio>
              <el-radio class="radio" v-model="contest.rule_type" label="OI" :disabled="disableRuleType">OI</el-radio>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Real_Time_Rank')">
              <el-switch
                v-model="contest.real_time_rank"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Status')">
              <el-switch
                v-model="contest.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24">
            <el-form-item :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <!-- <save @click.native="saveContest"></save> -->
      <el-button type="primary" round size="small" @click="changeClass()">提交</el-button>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateClass',
    components: {
      Simditor
    },
    data () {
      return {
        title: 'Create Class',
        disableRuleType: false,
        contest: {
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          rule_type: 'ACM',
          password: '',
          real_time_rank: true,
          visible: true,
          allowed_ip_ranges: [{
            value: ''
          }]
        },
        classes: {
          class_name: '',
          invitation_number: ''
        },
        classId: ''
      }
    },
    methods: {
      saveContest () {
        let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
        let data = Object.assign({}, this.contest)
        let ranges = []
        for (let v of data.allowed_ip_ranges) {
          if (v.value !== '') {
            ranges.push(v.value)
          }
        }
        data.allowed_ip_ranges = ranges
        api[funcName](data).then(res => {
          this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      },
      addIPRange () {
        this.contest.allowed_ip_ranges.push({value: ''})
      },
      removeIPRange (range) {
        let index = this.contest.allowed_ip_ranges.indexOf(range)
        if (index !== -1) {
          this.contest.allowed_ip_ranges.splice(index, 1)
        }
      },
      createClass () {
        api.CreateClass(this.classes.class_name, this.classes.invitation_number).then(res => {
          if (res.statusText === 'OK') {
            this.$success('Success')
            this.$router.push({name: 'class-list'})
          }
        }).catch(() => {
        })
      },
      saveClass () {
        api.ModifyClass(this.classId, this.classes.class_name, this.classes.invitation_number).then(res => {
          if (res.statusText === 'OK') {
            this.$success('Success')
            this.$router.push({name: 'class-list'})
          }
        }).catch(() => {
        })
      },
      getClassList () {
        api.getClassesList().then(res => {
          console.log(res)
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].id === this.classId) {
              this.classes.class_name = res.data.data[i].class_name
              this.classes.invitation_number = res.data.data[i].invitation_number
              break
            }
          }
        }).catch(() => {
        })
      },
      changeClass () {
        if (this.$route.name === 'edit-class') {
          this.saveClass()
        } else {
          this.createClass()
        }
      }
    },
    mounted () {
      if (this.$route.name === 'edit-class') {
        this.title = 'Edit Class'
        this.classId = this.$route.params.classId
        this.getClassList()
      }
    }
  }
</script>
