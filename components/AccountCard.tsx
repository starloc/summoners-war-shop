
export default function AccountCard({monster_name,price}:{monster_name:string,price:number}){
 return <div style={{border:'1px solid #4a382f',padding:16,borderRadius:12}}>
 <h3>{monster_name}</h3><p>{price.toLocaleString('vi-VN')}₫</p>
 </div>
}
