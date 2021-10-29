<template>
  <div style="max-width:70%;padding:10px;margin:auto">
    <div class="option">
      合同编号
      <el-input
        v-model="searchDTO.contractNo"
        clearable
        placeholder="请输入"
        style="width:20%;"
        prefix-icon="el-icon-search"
        size="medium"
      />
      合同名称
      <el-input
        v-model="searchDTO.contractName"
        clearable
        placeholder="请输入"
        style="width:20%;"
        prefix-icon="el-icon-search"
        size="medium"
      />
      状态
      <el-select
        v-model="searchDTO.type"
        placeholder="请选择"
        size="medium"
        style="width:20%;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="fromtoTime"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
           <el-dropdown trigger="click" style="float:right;height:50px;padding:3px;">
        <el-button icon="el-icon-s-operation" size="medium">
          列设置
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <span class="title">列设置</span>
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
    </div>

    <div>

      <div>
        <el-table
          :key="tableKey"
          :data="tableData"
          :height="tableHeight"
          :row-style="{height:'70px'}"
          :cell-style="{height:'none'}"
          :header-cell-style="{height:'80px',padding:0,background:'#f6f8fa',color:'#333'}"
          style="font-size: 16px"
          stripe="true"
          size="medium"
          tooltip-effect="dark"
          highlight-current-row
          @row-click="handelTableClick"
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
          <!--固定列-->
          <el-table-column fixed="right" label="关注" width="56">
            <template slot-scope="scope">
              <el-button
                style="height:10px;padding:0;margin:0;"
                type="text"
                size="mini"
                @click.native.stop="clueTableRowClick(scope.row,'collect')"
              >
                <img v-if="scope.row.collect===1" style="width:16px" src="@/assets/star.png">
                <img v-else style="width:16px" src="@/assets/star.png">
              </el-button>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="编辑" width="56">
            <template slot-scope="scope">
              <el-button
                style="height:10px;padding:0;margin:0;"
                type="text"
                size="mini"
                @click.native.stop="clueTableRowClick(scope.row,'edit')"
              >
                <img style="width:16px" src="@/assets/star.png">
              </el-button>
            </template>
          </el-table-column>
          <el-table-column />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { searchContract } from '@/api/contract-manage'

export default {
  name: 'ContractList',
  data() {
    return {
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
            picker.$emit('pick',[start,end])
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
      fromtoTime: ['2000-12-31','2001-12-31'],
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
      searchDTO: {
        contractNo: '',
        from: this.fromtoTime[0] || '',
        contractName: '',
        type: this.fromtoTime[1]||'',
        to: ''
      }

    }
  },

  created() {
     
  },

  methods: {
    fetchData(){
   console.log("searchDTO",this.searchDTO)
    searchContract(this.searchDTO).then(response => {
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
    },
    init() {
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
