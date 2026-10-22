const KEY = "loopify_demo_accounts_v2";
const msg = document.getElementById("message");
function seedAccounts(){
  const demo = [
    {name:"Loopify Admin",company:"Loopify",email:"admin@loopify.demo",password:"LoopifyAdmin123!",role:"admin"},
    {name:"Demo Seller",company:"Green Materials Co.",email:"seller@loopify.demo",password:"SellerDemo123!",role:"producer"},
    {name:"Demo Buyer",company:"Circular Buyers Ltd.",email:"buyer@loopify.demo",password:"BuyerDemo123!",role:"recycler"}
  ];
  let accounts=[]; try{accounts=JSON.parse(localStorage.getItem(KEY)||"[]")}catch{}
  for(const d of demo){if(!accounts.some(a=>a.email.toLowerCase()===d.email)){accounts.push(d)}}
  localStorage.setItem(KEY,JSON.stringify(accounts));
}
seedAccounts();
const signinTab=document.getElementById("signin-tab"), registerTab=document.getElementById("register-tab");
const signinForm=document.getElementById("signin-form"), registerForm=document.getElementById("register-form");
function switchTab(reg){signinForm.hidden=reg;registerForm.hidden=!reg;signinTab.classList.toggle("active",!reg);registerTab.classList.toggle("active",reg);msg.textContent=""}
signinTab.addEventListener("click",()=>switchTab(false));registerTab.addEventListener("click",()=>switchTab(true));
signinForm.addEventListener("submit",e=>{e.preventDefault();const email=document.getElementById("signin-email").value.trim().toLowerCase(),password=document.getElementById("signin-password").value;const accounts=JSON.parse(localStorage.getItem(KEY)||"[]");const user=accounts.find(a=>a.email.toLowerCase()===email&&a.password===password);if(!user){msg.textContent="Email or password is incorrect.";return}sessionStorage.setItem("loopify_demo_session",JSON.stringify({email:user.email,role:user.role,name:user.name}));location.href="/"});
registerForm.addEventListener("submit",e=>{e.preventDefault();const account={name:document.getElementById("reg-name").value.trim(),company:document.getElementById("reg-company").value.trim(),email:document.getElementById("reg-email").value.trim().toLowerCase(),password:document.getElementById("reg-password").value,role:document.getElementById("reg-role").value};let accounts=JSON.parse(localStorage.getItem(KEY)||"[]");if(accounts.some(a=>a.email.toLowerCase()===account.email)){msg.textContent="An account with this email already exists.";return}accounts.push(account);localStorage.setItem(KEY,JSON.stringify(accounts));sessionStorage.setItem("loopify_demo_session",JSON.stringify({email:account.email,role:account.role,name:account.name}));location.href="/"});