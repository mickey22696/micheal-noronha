"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {getNhost} from "../../../lib/nhost";

export default function AdminPage(){
 const [session,setSession]=useState(null),[profiles,setProfiles]=useState([]),[requests,setRequests]=useState([]),[error,setError]=useState(""),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false);
 const [selected,setSelected]=useState(""),[noteTitle,setNoteTitle]=useState(""),[noteMessage,setNoteMessage]=useState("");
 const [invoiceNo,setInvoiceNo]=useState(""),[amount,setAmount]=useState(""),[dueDate,setDueDate]=useState(""),[paymentUrl,setPaymentUrl]=useState("");
 async function load(){
  const n=getNhost(),s=n.getUserSession();setSession(s);
  if(!s?.user?.roles?.includes("admin")){setLoading(false);return;}
  try{
   const r=await n.graphql.request({query:`query AdminWorkspace{customer_profiles(order_by:{created_at:desc}){user_id full_name phone company_name industry country} service_requests(order_by:{created_at:desc}){id user_id services status budget timeline project_brief created_at}}`});
   if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);
   setProfiles(r.body.data.customer_profiles||[]);setRequests(r.body.data.service_requests||[]);
  }catch(e){setError(e.message||"Could not load admin data.");}
  finally{setLoading(false);}
 }
 useEffect(()=>{load();},[]);
 async function updateStatus(id,status){
  try{const r=await getNhost().graphql.request({query:`mutation UpdateStatus($id:uuid!,$status:String!){update_service_requests_by_pk(pk_columns:{id:$id},_set:{status:$status}){id}}`,variables:{id,status}});if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);await load();}
  catch(e){setError(e.message||"Could not update status.");}
 }
 async function addUpdate(e){
  e.preventDefault();const request=requests.find(x=>x.id===selected);if(!request)return;
  setBusy(true);setError("");
  try{const r=await getNhost().graphql.request({query:`mutation AddUpdate($object:project_updates_insert_input!){insert_project_updates_one(object:$object){id}}`,variables:{object:{user_id:request.user_id,service_request_id:request.id,title:noteTitle,message:noteMessage}}});if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);setNoteTitle("");setNoteMessage("");}
  catch(e){setError(e.message||"Could not publish the update.");}finally{setBusy(false);}
 }
 async function addInvoice(e){
  e.preventDefault();const request=requests.find(x=>x.id===selected);if(!request)return;
  setBusy(true);setError("");
  try{const r=await getNhost().graphql.request({query:`mutation AddInvoice($object:invoices_insert_input!){insert_invoices_one(object:$object){id}}`,variables:{object:{user_id:request.user_id,service_request_id:request.id,invoice_number:invoiceNo,amount:Number(amount),currency:"INR",status:"pending",due_date:dueDate||null,payment_url:paymentUrl||null}}});if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);setInvoiceNo("");setAmount("");setDueDate("");setPaymentUrl("");}
  catch(e){setError(e.message||"Could not create invoice.");}finally{setBusy(false);}
 }
 if(loading)return <main className="portal-app"><div className="portal-loading">Loading admin workspace…</div></main>;
 if(!session)return <main className="portal-public"><div className="wrap onboarding-wrap"><div className="onboard-card"><h2>Sign in required</h2><Link href="/portal/sign-in">Client sign in</Link></div></div></main>;
 if(!session.user?.roles?.includes("admin"))return <main className="portal-public"><div className="wrap onboarding-wrap"><div className="onboard-card"><p className="eyebrow">RESTRICTED AREA</p><h2>Admin access only.</h2><p>This account does not have the admin role.</p><Link className="btn primary" href="/portal">Return to portal ↗</Link></div></div></main>;
 return <main className="portal-app"><div className="portal-topline"><div className="wrap"><Link href="/portal">← Client portal</Link><span>ADMIN WORKSPACE</span><Link href="/">Website ↗</Link></div></div><div className="wrap admin-content">
  <p className="eyebrow">OPERATIONS</p><h1>Client <span>overview.</span></h1>{error&&<p className="form-error">{error}</p>}
  <div className="portal-stats"><div className="portal-stat"><small>Total clients</small><b>{profiles.length}</b></div><div className="portal-stat"><small>Service requests</small><b>{requests.length}</b></div><div className="portal-stat"><small>New requests</small><b>{requests.filter(r=>r.status==="new").length}</b></div></div>
  <h2 className="admin-heading">Recent enquiries</h2>
  {requests.map(r=><article className="request-card" key={r.id}><div className="request-card-top"><span className="request-id">{r.id.slice(0,8).toUpperCase()} · {profiles.find(p=>p.user_id===r.user_id)?.full_name||r.user_id}</span><select value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}><option value="new">New</option><option value="reviewing">Reviewing</option><option value="proposal">Proposal</option><option value="in_progress">In progress</option><option value="on_hold">On hold</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div><h3>{(r.services||[]).join(" · ")}</h3><p>{r.project_brief}</p><small>Budget: {r.budget||"—"} · Timeline: {r.timeline||"—"}</small></article>)}
  <h2 className="admin-heading">Send a project update</h2>
  <form className="admin-form" onSubmit={addUpdate}><label className="field"><span>Choose project</span><select required value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select a request</option>{requests.map(r=><option key={r.id} value={r.id}>{profiles.find(p=>p.user_id===r.user_id)?.full_name||"Client"} — {(r.services||[]).join(", ")}</option>)}</select></label><label className="field"><span>Update title</span><input required value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="e.g. Initial design review" /></label><label className="field"><span>Message</span><textarea required rows="3" value={noteMessage} onChange={e=>setNoteMessage(e.target.value)} placeholder="Write the update the customer will see…" /></label><button className="btn primary" disabled={busy||!selected}>{busy?"Publishing…":"Publish update ↗"}</button></form>
  <h2 className="admin-heading">Create an invoice</h2>
  <form className="admin-form" onSubmit={addInvoice}><label className="field"><span>Choose project</span><select required value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select a request</option>{requests.map(r=><option key={r.id} value={r.id}>{profiles.find(p=>p.user_id===r.user_id)?.full_name||"Client"} — {(r.services||[]).join(", ")}</option>)}</select></label><div className="form-grid"><label className="field"><span>Invoice number</span><input required value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} /></label><label className="field"><span>Amount (INR)</span><input required type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} /></label><label className="field"><span>Due date</span><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></label><label className="field"><span>Payment URL (optional)</span><input type="url" value={paymentUrl} onChange={e=>setPaymentUrl(e.target.value)} placeholder="https://" /></label></div><button className="btn primary" disabled={busy||!selected}>{busy?"Creating…":"Create invoice ↗"}</button></form>
 </div></main>;
}
