import { imageBlurProcessing } from '../../index';
let image = require('./../assets/images/001.jpg');  
new Vue({
  el: "#app",

  data() {
     
    return {
      beforeImage: image,
      afterImage:null,
      processTime:0,
      isProcessing:false,
      size: 20,
      reverse: false,
      count: 0,
      crop : {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }
  },

 
  mounted() {

 
  },
  created() {
    console.log(image)
 

  },
  methods:{
    change({coordinates, canvas}) {
      this.crop= coordinates
    },    
    blur: function(){
      this.afterImage = null
      this.isProcessing = true
      let startTime = new Date()
      let src = "." + this.beforeImage
      let options = {
        size: parseInt(this.size),
        rect: this.crop,
        reverse: this.reverse,
      }

      setTimeout(
        function () {
          imageBlurProcessing(src,options).then((res) => {
            const endTime = new Date();
            this.processTime = endTime - startTime
            this.isProcessing = false
            this.afterImage = res
          })
        }.bind(this), 
        10
      );      
      
    },
    onFileChang(e) {
   
      let reader = new FileReader()
      this.afterImage = null
      reader.addEventListener(
        'load',
        function(event) {
          try {
            this.beforeImage = event.target.result
            let image = new Image()
            image.src = event.target.result
            image.onload = () => {
              console.log(image.width)
              console.log()
            }
          } catch (error) {
            console.error(error)
          }        
        }.bind(this)
        )
        reader.readAsDataURL(e.target.files[0])     
      
    }
  }
});
