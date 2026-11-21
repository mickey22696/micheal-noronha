"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNhost } from "../../lib/nhost";

const tabs=["Overview","Services & projects","Updates","Invoices","Profile"];

export default function PortalPage(){
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [requests,setRequests]=useState([]);
  const [updates,setUpdates]=useState([]);
  const [invoices,setInvoices]=useState([]);
  const [tab,setTab]=useState("Overview");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [saving,setSaving]=useState(false);
  const [profileForm,setProfileForm]=useState({});
  const [showRequest,setShowRequest]=useState(false);
  const [requestForm,setRequestForm]=useState({services:[],budget:"",timeline:"",project_brief:""});

  async function load(){
    const nhost=getNhost(); const current=nhost.getUserSession();
    if(!current?.user?.id){setSession(null);setLoading(false);return;}
    setSession(current);
    try{
      const result=await nhost.graphql.request({
        query:`query CustomerPortal($userId: uuid!){
          customer_profiles(where:{user_id:{_eq:$userId}},limit:1){full_name phone job_title company_name company_website industry company_size country}
          service_requests(where:{user_id:{_eq:$userId}},order_by:{created_at:desc}){id services budget timeline project_brief status created_at}
          project_updates(where:{user_id:{_eq:$userId}},order_by:{created_at:desc},limit:30){id title message created_at}
          invoices(where:{user_id:{_eq:$userId}},order_by:{created_at:desc}){id invoice_number amount currency status due_date payment_url}
        }`,
        variables:{userId:current.user.id}
      });
      if(result.body?.errors?.length) throw new Error(result.body.errors[0].message);
      const data=result.body?.data||{};
      const p=data.customer_profiles?.[0]||null;
      setProfile(p); setProfileForm(p||{});
      setRequests(data.service_requests||[]); setUpdates(data.project_updates||[]); setInvoices(data.invoices||[]);
    }catch(err){setError(err?.message||"Unable to load your portal. Please check the database setup.");}
    finally{setLoading(false);}
  }

  useEffect(()=>{
    const nhost=getNhost();
    const unsubscribe=nhost.sessionStorage.onChange((next)=>{setSession(next);if(!next)setLoading(false);});
    load();
    return ()=>unsubscribe();
  },[]);

  async function signOut(){getNhost().clearSession();setSession(null);window.location.href="/portal/sign-in";}
  async function saveProfile(e){
    e.preventDefault();setSaving(true);setError("");
    try{
      const r=await getNhost().graphql.request({query:`mutation UpdateProfile($userId:uuid!,$object:customer_profiles_set_input!){update_customer_profiles(where:{user_id:{_eq:$userId}},_set:$object){affected_rows}}`,variables:{userId:session.user.id,object:{full_name:profileForm.full_name,phone:profileForm.phone,job_title:profileForm.job_title,company_name:profileForm.company_name,company_website:profileForm.company_website,industry:profileForm.industry,company_size:profileForm.company_size,country:profileForm.country}}});
      if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);
      await load();setTab("Overview");
    }catch(err){setError(err?.message||"Could not save profile.");}finally{setSaving(false);}
  }
  async function createRequest(e){
    e.preventDefault();setSaving(true);setError("");
    try{
      const r=await getNhost().graphql.request({query:`mutation NewRequest($object:service_requests_insert_input!){insert_service_requests_one(object:$object){id}}`,variables:{object:{services:requestForm.services,budget:requestForm.budget||null,timeline:requestForm.timeline||null,project_brief:requestForm.project_brief||null}}});
      if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);
      setShowRequest(false);setRequestForm({services:[],budget:"",timeline:"",project_brief:""});await load();setTab("Services & projects");
    }catch(err){setError(err?.message||"Could not submit the request.");}finally{setSaving(false);}
  }

  if(loading)return <main className="portal-app"><div className="portal-loading">Preparing your workspace…</div></main>;
  if(!session)return <main className="portal-public"><section className="wrap onboarding-wrap"><div className="onboard-card signin-card"><p className="eyebrow">CLIENT PORTAL</p><h2>Your workspace is one sign-in away.</h2><p>Sign in to access your services, projects and updates.</p><Link className="btn primary" href="/portal/sign-in">Client sign in ↗</Link><p className="signin-prompt">New client? <Link href="/onboard">Start onboarding</Link></p></div></section></main>;

  const user=session.user;
  const isAdmin=(user.roles||[]).includes("admin");
  const firstName=(profile?.full_name||user.displayName||user.email||"there").split(" ")[0];

  return <main className="portal-app">
    <div className="portal-topline"><div className="wrap"><Link href="/">← Back to website</Link><span>SECURE CLIENT WORKSPACE</span><button onClick={signOut}>Sign out ↗</button></div></div>
    <div className="wrap portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-brand">MN<span>.</span><small>CLIENT PORTAL</small></div>
        <nav>{tabs.map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}>{item}</button>)}
          {isAdmin&&<Link className="admin-link" href="/portal/admin">Admin workspace ↗</Link>}
        </nav>
        <div className="portal-user"><div className="avatar">{firstName.slice(0,1).toUpperCase()}</div><div><b>{profile?.full_name||user.displayName||"Client"}</b><small>{user.email}</small></div></div>
      </aside>
      <section className="portal-content">
        {error&&<div className="portal-alert">{error}<button onClick={()=>setError("")}>×</button></div>}
        {tab==="Overview"&&<><p className="eyebrow">YOUR WORKSPACE</p><h1>Good to see you, <span>{firstName}.</span></h1><p className="portal-lead">Here’s what’s happening with your business and projects.</p>
          <div className="portal-stats"><Stat label="Active requests" value={requests.filter(x=>!["completed","cancelled"].includes(x.status)).length}/><Stat label="Project updates" value={updates.length}/><Stat label="Invoices" value={invoices.length}/></div>
          <div className="portal-section-head"><div><p className="eyebrow">PROJECT OVERVIEW</p><h2>Your services</h2></div><button className="btn primary" onClick={()=>setShowRequest(true)}>+ New request</button></div>
          {requests.length?requests.slice(0,3).map(r=><RequestCard key={r.id} item={r}/>):<div className="portal-empty"><b>Your project journey starts here.</b><p>Tell me what you need and I’ll prepare the next steps.</p><button className="btn primary" onClick={()=>setShowRequest(true)}>Request a service ↗</button></div>}
          <div className="portal-section-head"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent updates</h2></div><button className="btn-quiet" onClick={()=>setTab("Updates")}>View all →</button></div>
          {updates.length?updates.slice(0,3).map(u=><UpdateRow key={u.id} item={u}/>):<p className="portal-muted">No updates yet. Any project updates will appear here.</p>}
        </>}
        {tab==="Services & projects"&&<><p className="eyebrow">YOUR WORK</p><h1>Services &amp; <span>projects.</span></h1><div className="portal-section-head"><p className="portal-lead">All your enquiries and active work in one place.</p><button className="btn primary" onClick={()=>setShowRequest(true)}>+ New request</button></div>{requests.length?requests.map(r=><RequestCard key={r.id} item={r}/>):<div className="portal-empty">No service requests yet.</div>}</>}
        {tab==="Updates"&&<><p className="eyebrow">PROJECT ACTIVITY</p><h1>Updates &amp; <span>notes.</span></h1>{updates.length?updates.map(u=><UpdateRow key={u.id} item={u}/>):<div className="portal-empty">There are no project updates yet.</div>}</>}
        {tab==="Invoices"&&<><p className="eyebrow">BILLING</p><h1>Invoices &amp; <span>payments.</span></h1><div className="portal-table">{invoices.length?invoices.map(i=><div className="invoice-row" key={i.id}><div><b>{i.invoice_number||"Invoice"}</b><small>Due {i.due_date||"—"}</small></div><strong>{i.currency||"INR"} {Number(i.amount||0).toLocaleString("en-IN")}</strong><span className={"status-pill "+(i.status||"pending")}>{i.status||"pending"}</span>{i.payment_url?<a href={i.payment_url} target="_blank" rel="noreferrer">Pay ↗</a>:<span className="portal-muted">—</span>}</div>):<div className="portal-empty">Invoices and payment links will appear here when issued.</div>}</div></>}
        {tab==="Profile"&&<><p className="eyebrow">YOUR DETAILS</p><h1>Account <span>profile.</span></h1><form className="portal-profile-form" onSubmit={saveProfile}><div className="form-grid">
          {["full_name","phone","job_title","company_name","company_website","industry","company_size","country"].map(k=><label className="field" key={k}><span>{({full_name:"Full name",phone:"Phone",job_title:"Your role",company_name:"Business name",company_website:"Website",industry:"Industry",company_size:"Business size",country:"Country"})[k]}</span><input value={profileForm[k]||""} onChange={e=>setProfileForm(old=>({...old,[k]:e.target.value}))}/></label>)}
        </div><button className="btn primary" disabled={saving}>{saving?"Saving…":"Save profile ↗"}</button></form></>}
      </section>
    </div>
    {showRequest&&<div className="portal-modal-backdrop" onClick={()=>setShowRequest(false)}><form className="portal-modal" onSubmit={createRequest} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" onClick={()=>setShowRequest(false)}>×</button><p className="eyebrow">NEW ENQUIRY</p><h2>What can I help you with?</h2><div className="service-options compact-options">{["Website design & development","UI/UX & product design","Web or mobile application","E-commerce","SaaS / API / integrations","Automation & growth systems","Cloud / DevOps / IT consulting"].map(s=><button type="button" key={s} className={requestForm.services.includes(s)?"option selected":"option"} onClick={()=>setRequestForm(f=>({...f,services:f.services.includes(s)?f.services.filter(x=>x!==s):[...f.services,s]}))}><span>{requestForm.services.includes(s)?"✓":"+"}</span>{s}</button>)}</div><div className="form-grid"><Field label="Budget"><input value={requestForm.budget} onChange={e=>setRequestForm(f=>({...f,budget:e.target.value}))}/></Field><Field label="Timeline"><input value={requestForm.timeline} onChange={e=>setRequestForm(f=>({...f,timeline:e.target.value}))}/></Field><Field label="Project brief" wide><textarea rows="4" value={requestForm.project_brief} onChange={e=>setRequestForm(f=>({...f,project_brief:e.target.value}))}/></Field></div><button className="btn primary" disabled={saving||!requestForm.services.length}>{saving?"Sending…":"Submit service request ↗"}</button></form></div>}
  </main>;
}

function Stat({label,value}){return <div className="portal-stat"><small>{label}</small><b>{value}</b></div>}
function RequestCard({item}){return <article className="request-card"><div className="request-card-top"><span className="request-id">REQUEST / {item.id.slice(0,8).toUpperCase()}</span><span className={"status-pill "+item.status}>{(item.status||"new").replaceAll("_"," ")}</span></div><h3>{(item.services||[]).join(" · ")||"Service request"}</h3><p>{item.project_brief||"We’ll be in touch with the next steps."}</p><div className="request-meta"><span>Budget: {item.budget||"To be discussed"}</span><span>Timeline: {item.timeline||"Flexible"}</span><span>Submitted: {new Date(item.created_at).toLocaleDateString("en-IN")}</span></div></article>}
function UpdateRow({item}){return <article className="update-row"><span className="update-dot"/><div><b>{item.title}</b><p>{item.message}</p><small>{new Date(item.created_at).toLocaleDateString("en-IN")}</small></div></article>}
function Field({label,wide,children}){return <label className={"field"+(wide?" field-wide":"")}><span>{label}</span>{children}</label>}
