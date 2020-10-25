// Handler Builder 中 onText() 如果使用 Regular Expression 會把 match 的結果傳入第二個參數
module.exports = async (context, match) => {
  const { userId, displayName } = context.session.user;

  // 檢查訂單裡面有沒有這個人點過的東西
  if (context.state.訂單.some(obj => obj.userId === userId)) {
    await context.sendText(
      `${displayName} 你已經點過了，可以輸入「取消」再點一次`
    );
  } else {
    // 去掉前後空白
    const order = match[1].trim();

    // 把訂單塞進 state 中
    context.setState({
      ...context.state,
      訂單: context.state.訂單.concat({
        name: displayName,
        userId,
        order,
      }),
    });


    const sortedOrders = context.state.訂單.sort((a, b) => a.order.localeCompare(b.order))
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
      .map(o =>`${o} 有 ${sortedOrders[o].length} 人，分別是 ${sortedOrders[o].join(', ')} `).join('\n');
    
    if(sortedOrders[o].length == 3){
      await context.sendText('Invite');
    } else {
      await context.sendText('gggg');
    }
    
    await context.sendText(result || '沒有人玩QQ');

    
    
  }
};