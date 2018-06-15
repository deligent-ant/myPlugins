<template>
  <div>
    <el-upload action=""
      :before-upload="handleImportXLSX"
      :show-file-list="false">
      <el-tooltip content="只能导入xls/xlsx文件"
        placement="top"
        effect="dark">
        <el-button size="small"
          type="primary">批量导入</el-button>
      </el-tooltip>
    </el-upload>
  </div>
</template>
<script>
import XLSX from 'xlsx'

export default {
  props: {
    onImport: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    async handleImportXLSX(file) {
      const { checkFileType, readXLSX } = this
      if (checkFileType(file.name)) {
        this.$props.onImport(
          await readXLSX(file).catch(e => {
            console.log(e)
          })
        )
      } else {
        this.$props.onImport({
          message: '文件类型不支持，请上传 xls/xlsx 文件'
        })
      }
      return Promise.reject()
    },
    checkFileType(name) {
      return /\.xlsx?$/.test(name)
    },
    readXLSX(file) {
      return new Promise((res, rej) => {
        const fileReader = new FileReader()
        const onLoadXLS = e => {
          try {
            const workbook = XLSX.read(e.target.result, {
              type: 'binary'
            })
            const data = []
            let fromTo = ''
            for (let sheet in workbook.Sheets) {
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref']
                console.log(fromTo)
                data.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
              }
            }
            res(data)
          } catch (e) {
            rej({ message: '读取失败，请重试', ...e })
          }
        }
        fileReader.onload = onLoadXLS
        fileReader.readAsBinaryString(file)
      })
    }
  }
}
</script>
