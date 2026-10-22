let session;try{session=JSON.parse(sessionStorage.getItem("loopify_demo_session")||"null")}catch{}if(!session){location.replace("/login.html")}else{
document.getElementById("who").textContent=session.name+" · "+session.email;
document.getElementById("role-tag").textContent=session.role.toUpperCase();
const info={
 admin:{title:"Admin portal",subtitle:"Manage the platform overview and registered demo accounts.",tiles:[["🛡️","Platform overview","Review platform activity and role access."],["👥","User directory","Review accounts registered in this browser."],["📊","Business analytics","Connect live sales and expenses through the Neon API."]]},
 producer:{title:"Seller portal",subtitle:"Prepare material listings and track their progress.",tiles:[["♻️","My materials","Create and manage material listings once the API is connected."],["📦","Bulk lots","Group compatible material quantities."],["🚚","Pickup & delivery","Track collection and transport statuses."]]},
 recycler:{title:"Buyer portal",subtitle:"Find materials and track purchase requests.",tiles:[["🔎","Browse materials","Explore available materials once the marketplace API is connected."],["🛒","My orders","Track purchase requests and order status."],["♻️","Recovered resources","Connect recovered materials with buyers."]]}
}[session.role]||{title:"Loopify portal",subtitle:"Your workspace",tiles:[]};
document.getElementById("title").textContent=info.title;document.getElementById("subtitle").textContent=info.subtitle;
document.getElementById("tiles").innerHTML=info.tiles.map(t=>`<article class="tile"><div class="icon">${t[0]}</div><h2>${t[1]}</h2><p>${t[2]}</p></article>`).join("");
if(session.role==="admin"){const panel=document.getElementById("admin-tools");panel.hidden=false;let accounts=[];try{accounts=JSON.parse(localStorage.getItem("loopify_demo_accounts_v2")||"[]")}catch{};document.getElementById("accounts").innerHTML=accounts.length?`<table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>${accounts.map(a=>`<tr><td>${escapeHtml(a.name)}</td><td>${escapeHtml(a.email)}</td><td>${escapeHtml(a.role)}</td></tr>`).join("")}</tbody></table>`:"No accounts yet"}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.getElementById("logout").addEventListener("click",()=>{sessionStorage.removeItem("loopify_demo_session");location.replace("/login.html")});