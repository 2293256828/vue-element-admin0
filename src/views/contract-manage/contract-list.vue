<template>
  <div class="main" style="padding:10px;text-align:center;">
    <div class="option" style="text-align:center;margin-left:5%;">
      <div style="float:left;padding:10px;">
        <div class=""> 合同编号</div>
        <el-input
          v-model="contractNo"
          clearable
          placeholder="请输入"
          style="min-width:13%;"
          prefix-icon="el-icon-search"
          size="medium"
        />
      </div>
      <div style="float:left;padding:10px;">
        <div class=""> 合同名称</div>
        <el-input
          v-model="contractName"
          clearable
          placeholder="请输入"
          style="min-width:13%;"
          prefix-icon="el-icon-search"
          size="medium"
        />
      </div>
      <div style="float:left;padding:10px;">
        <div class=""> 状态</div>
        <el-select
          v-model="type"
          placeholder="请选择"
          size="medium"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="float:left;padding:10px;">
        <div class=""> 完成时间</div>
        <el-date-picker
          v-model="fromtoTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </div>
    </div>

    <div style="clear:both;text-align:center;padding:3px;">
      <el-dropdown trigger="click">
        <el-button icon="el-icon-s-operation">
          列设置
        </el-button>
        <el-dropdown-menu slot="dropdown" style="margin:auto">
          <span class="">列设置</span>
          <el-tree
            draggable
            :data="columns"
            :props="defaultProps"
            :allow-drop="allowDrop"
            @node-drop="handleDrop"
          >
            <span slot-scope="{node,data}" class="tree-table-setting">
              <el-switch v-model="data.show" @change="saveTableColumns" />
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="el-icon-s-operation" style="margin-left:8px">
        重置
      </el-button>
      <el-button icon="el-icon-search" @click.native="fetchData">
        查询
      </el-button>
    </div>

    <div>
      <el-table
        :key="tableKey"

        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
        :row-style="{height:'50px'}"
        :cell-style="{height:'none'}"
        :header-cell-style="{height:'60px',padding:0,background:'#f6f8fa',color:'#333'}"
        style="font-size: 16px;max-width: 81%;margin-left:4%"
        stripe
        size="medium"
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @header-dragend="surverWidth"
      >
        <el-table-column align="center" type="selection" />
        <template v-for="item in columns">
          <el-table-column
            v-if="item.show"
            :key="item.prop"
            show-overflow-tooltip
            :prop="item.prop"
            :sortable="item.sortable"
            :label="item.label"
            :width="item.width"
            :resizable="item.resizable"
          >
            <template slot-scope="scope">
              <span v-if="item.prop==='clue_type'">{{ scope.row[item.prop]|clueType }}</span>
              <span v-else-if="item.prop==='clue_source'">{{ scope.row[item.prop]|clueSource }}</span>
              <span v-else-if="item.prop==='contact_type'">{{ scope.row[item.prop]|commonType }}</span>
              <span v-else-if="item.prop==='company_name'" class="link">{{ scope.row[item.prop] }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>

        <el-table-column fixed="right" label="" width="56">
          <template slot-scope="scope">
            <el-button
              style="height:10px;padding:0;margin:0;"
              type="text"
              size="medium"
              @click.native.stop="clueTableRowClick(scope.row,'edit')"
            >
              <el-button type="danger" icon="el-icon-delete" circle size="mini" style="float:right" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column />
      </el-table>
    </div>

  </div>
</template>

<script>
import { searchContract } from '@/api/contract-manage'
import { parseTime } from '@/utils/index'

export default {
  name: 'ContractList',
  data() {
    return {
      loading: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime - 3600 * 7 * 24 * 1000)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
        ]
      },
      fromtoTime: [],
      tableKey: 1,
      tableData: [],
      tableHeight: 600,
      columns: [
        {
          prop: 'contractNo',
          label: '合同编号',
          width: 200,
          resizable: true,
          show: true,
          sortable: false
        },
        {
          prop: 'contractName',
          label: '合同名称',
          width: 200,
          resizable: true,
          show: true,
          sortable: false
        },
        {
          prop: 'time',
          label: '完成时间',
          width: 200,
          resizable: true,
          show: true,
          sortable: true
        },
        {
          prop: 'type',
          label: '状态',
          width: 200,
          resizable: true,
          show: true,
          sortable: false
        }
      ],
      options: [
        { label: '起草完成待会签', value: 1 },
        { label: '会签完成待定稿', value: 2 },
        { label: '定稿完成待审批', value: 3 },
        { label: '审批完成待签定', value: 4 },
        { label: '签订完成', value: 5 }
      ],
      // 列设置中,tree配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      contractNo: '',
      contractName: '',
      type: ''

    }
  },
  computed: {
    from: function() { return parseTime(this.fromtoTime && this.fromtoTime[0], '{y}-{m}-{d}') || '' },
    to: function() { return parseTime(this.fromtoTime && this.fromtoTime[1], '{y}-{m}-{d}') || '' }
  },

  created() {
    this.fetchData()
  },
  beforeDestroy() {
    this.saveTableColumns()
  },
  methods: {
    fetchData() {
      this.loading = true
      searchContract({
        contractNo: this.contractNo,
        contractName: this.contractName,
        from: this.from,
        to: this.to,
        type: this.type }).then(response => {
        const data = response
        for (let i = 0, len = data.length; i < len; i++) {
          switch (data[i].type) {
            case 1:
              data[i].type = '起草完成待会签'
              break
            case 2:
              data[i].type = '会签完成待定稿'
              break
            case 3:
              data[i].type = '定稿完成待审批'
              break
            case 4:
              data[i].type = '审批完成待签定'
              break
            case 5:
              data[i].type = '签订完成'
              break
          }
        }
        console.log(data)
        this.tableData = data
      })
      this.loading = false
    },
    init() {
      this.columns = localStorage.getItem('clueTable') || this.columns
      // 判断本地是否有表格配置数据?加载:忽略
      // 获取表格数据
      // 重设表格高度
    },
    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner'
    },
    handleDrop() {
      this.tableKey++
      this.saveTableColumns()
    },
    resetTable() {

    },
    saveTableColumns() {
      localStorage.setItem('clueTable', this.columns)
    },
    handleTableClick(row) {

    },
    handleSelectionChange(val) {

    },
    surverWidth(newWidth, oldWidth, column, event) {
      this.columns = this.columns.map(v => {
        if (v.prop === column.property) {
          v.width = newWidth
          return v
        }
      })
    },
    clueTableRowClick(val, type) {

    }
  }
}
</script>
<style lang="scss" scoped>
</style>
