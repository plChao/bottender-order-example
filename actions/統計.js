module.exports = async context => {
  const sortedOrders = context.state.訂單
    // 按照文字排序
    .sort((a, b) => a.order.localeCompare(b.order))
    .reduce((prev, o) => {
      const { name, order } = o;

      // 檢查有沒有人點過一樣的東西
      const match = Object.keys(prev).find(k => order === k);
      if (match) {
        // 有人的話就把名字接在 array 後面
        return {
          ...prev,
          [order]: prev[order].concat(name),
        };
      }
      // 或者新開 array
      return { ...prev, [order]: [name] };
    }, {});

  const orderNames = Object.keys(sortedOrders);

  // 稍微排版一下，一行一種物品
  const result = orderNames
    .map(
      o =>
        `${o} 有 ${sortedOrders[o].length} 人，分別是 ${sortedOrders[o].join(
          ', '
        )} 點的`
    )
    .join('\n');
  await context.sendText(orderNames || '沒有訂單QQ');
  
  if(sortedOrders[o].length == 3){
      const newmes = `開玩桌游囉!!`; 
      await context.sendText(newmes);
  }
  // 避免沒有訂單傳送空字串出現錯誤
  
};
