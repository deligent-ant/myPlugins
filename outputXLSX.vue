<template>
  <div class="page">
    <el-button type="primary"
      size="mini"
      @click="outputXlSX">
      <slot>批量导出</slot>
    </el-button>
  </div>
</template>

<script type="text/ecmascript-6">
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      fileName: '批量导出的结果'
    }
  },
  props: {
    params: {
      type: Object,
      default: () => {} //{jsonData:[],keyMap:{name:'名字'}}
    }
  },

  methods: {
    outputXlSX() {
      //确保外面传入数据

      if (
        !(this.params && this.params.jsonData && this.params.jsonData.length)
      ) {
        return this.$message({
          showClose: true,
          duration: 1500,
          message: '请确保输入待转化的json格式正确',
          type: 'error'
        })
      }
      //弹窗获得保存的文件名
      this.$prompt(
        '请输入要保存的文件名，否则默认取名为：批量导出的结果',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(({ value }) => {
          this.fileName = value
          this.exportExcel()
        })
        .catch(() => {
          this.exportExcel()
        })
    },

    //导出表格
    exportExcel() {
      //生成一个workbook
      let wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} }

      let jsonArray = this.params.jsonData.map(item => {
        let newItem = {}
        for (let [key, value] of Object.entries(this.params.keyMap)) {
          newItem[value] = item[key]
        }
        return newItem
      })
      /* 把json转成sheet */
      var sheet1 = XLSX.utils.json_to_sheet(jsonArray)
      wb.Sheets['Sheet1'] = sheet1
      // XLSX.utils.sheet_to_csv(wb)
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `${this.fileName}.xlsx`
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
