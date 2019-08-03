export function imageBlurProcessing(src,{size = 1,rect = null,reverse=false}) {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext('2d')
  const image = new Image()
  const name_ext = src.match(".+/(.+?)([\?#;].*)?$")[1];
  let ext = name_ext.substring(name_ext.lastIndexOf('.') + 1,name_ext.length);
  if(ext == 'jpg')ext = 'jpeg' // なんか image/jpg　でbase64化すると image/png　になってしまう。
  const type = `images/${ext}`
  image.src = src
  let startTime = Date.now(); // 開始時間


  return new Promise((resolve, reject) => {
  
    image.onload = () => {

      let blurStartX = (rect)?rect.left: 0
      let blurStartY = (rect)?rect.top:0
      let blurWidth = (rect)?rect.width: image.width
      let blurHeight = (rect)?rect.height: image.height
      let blurEndX = blurStartX + blurWidth
      let blurEndY = blurStartY + blurHeight

      canvas.height = image.height
      canvas.width = image.width
      context.drawImage(image, 0, 0)
      
      const imageData = context.getImageData(0, 0, image.width, image.height)
      let newImageData = context.getImageData(0, 0, image.width, image.height);
      const w = image.width * 4

      imageData.data.forEach((_, i) => {
        if(i % 4 == 0){
          const y = parseInt(i / w)
          const x = (i % (w)) / 4;
          if ((y > blurStartY && y < blurEndY && x > blurStartX && x < blurEndX) != reverse){
            let rgba = [0,0,0,0]
            let count = 0
            for (let nx = x - size;nx < x + size + 1;nx++){
              for (let ny = y - size;ny < y + size + 1;ny++){
                const num = (nx * 4) + (ny * w)
                if(num > 0 && num < imageData.data.length){
                  rgba[0] += imageData.data[num]
                  rgba[1] += imageData.data[num + 1]
                  rgba[2] += imageData.data[num + 2]
                  rgba[3] += imageData.data[num + 3]
                  count++
                }
              }
            }  
            newImageData.data[i] = rgba[0] / count
            newImageData.data[i + 1] = rgba[1] / count
            newImageData.data[i + 2] = rgba[2] / count
            newImageData.data[i + 3] = rgba[3] / count           
          } else {
            newImageData.data[i] = imageData.data[i]
            newImageData.data[i + 1] = imageData.data[i + 1]
            newImageData.data[i + 2] = imageData.data[i + 2]
            newImageData.data[i + 3] = imageData.data[i + 3]
          }  
        }
      })

      context.putImageData(newImageData,0,0)
      const base64 = canvas.toDataURL(type);
      const endTime = new Date()
      console.log("処理時間")
      console.log(endTime - startTime); 
      resolve(base64)
    };
    image.onerror = (e) => reject(e)
  });

}
