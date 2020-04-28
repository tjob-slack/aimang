export default {
  data() {
    return {
      docs: []
    }
  },
  async created() {
    // 登录
    await this.$cloudbase.auth({ persistence: "local" }).signInWithTicket(ticket)
    // 数据库查询
    const queryResult = await this.$cloudbase.database().collection('test').where({}).get()
    this.docs = queryResult.data
  }
}