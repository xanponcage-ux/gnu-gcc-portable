export const ResponceData = async (results: any) => {
    const table: any = [];
    const header: any = [];
    if (results?.metaData?.length && results?.rows?.length) {
      for (let i = 0; i < results.metaData?.length; i++) {
        header.push((results.metaData[i].name as string).replace(/ /g, ''))
      }
  
      for (let i = 0; i < results.rows.length; i++) {
        const arr = results.rows[i];
        var jsonObj: any = {};
        header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
        await table.push(jsonObj)
      }
    }
  
    return await table
  }