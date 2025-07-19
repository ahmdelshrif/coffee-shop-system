/* eslint-disable import/no-extraneous-dependencies */
const qs = require('qs');

class Apifeauture {

    constructor(mongoosequery,qureystring)
    {
        // eslint-disable-next-line no-unused-expressions
        this.mongoosequery=mongoosequery
        this.qureystring=qureystring
    }
//علي حسب الاكثر مبيعا 
     filtring(){
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        let qureystring={...this.qureystring}
        qureystring=qs.parse(qureystring)
        
        
        const excudefild=["page","limit","sold","fields","sort","keyword"]    
        excudefild.forEach((field)=>{ delete qureystring[field]})
        
        qureystring=JSON.stringify(qureystring).replace(/\b(gte|gt|lte|lt)\b/g, (value)=>  `$${value}`)
        this.mongoosequery=this.mongoosequery.find(JSON.parse(qureystring))
        return this;
    }
// ترتيب
    sort(){
        if(this.qureystring.sort)
            {
                
                const sortBy=this.qureystring.sort.split(`,`).join(` `);
             
               this.mongoosequery=this.mongoosequery.sort(sortBy) 
            }else{
                this.mongoosequery=this.mongoosequery.sort(`createdAt`)
            }
            return this
    }
    // تظهر حاجات معينه 
    fields(){
        if(this.qureystring.fields)
            {
                const sortBy=this.qureystring.fields.split(`,`).join(` `);
               
                this.mongoosequery=this.mongoosequery.select(sortBy)
            }else{
                this.mongoosequery=this.mongoosequery.select("-__v" )
            }
            return this
    }
// تعمل سيرش علي كلمه او حرف معين 
    search(namemodel){
        if(this.qureystring.keyword)
            {
                const query={}
                if(namemodel==="product"){
                    query.$or =[{title:{$regex: this.qureystring.keyword , $options:"i"}},
                        {description:{$regex: this.qureystring.keyword , $options:"i"}}  ]
                }else{
                    query.$or =[{name :{$regex: this.qureystring.keyword , $options:"i"}}]
                }
                this.mongoosequery=this.mongoosequery.find(query)
            
            }
            return this
    }

pagenation(countDecoments){
     const page=this.qureystring.page *1 || 1;  
         const limt=this.qureystring.limit *1 || 5;
         const skip=(page-1)*limt
         const indexecd=page*limt;
         const pagenationResulte={}
         pagenationResulte.page=page
         pagenationResulte.limit=limt
         pagenationResulte.numberofpage=Math.ceil(countDecoments/limt)

         if(indexecd <countDecoments )
         {
            pagenationResulte.next=page+1
         }
         if(skip>0)
         {
            pagenationResulte.prev=page-1
         }
         this.pagenationResulte=pagenationResulte
         this.mongoosequery=this.mongoosequery.limit(limt).skip(skip)
         return this
    
}


}
module.exports=Apifeauture