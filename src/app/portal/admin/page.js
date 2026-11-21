"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {getNhost} from "../../../lib/nhost";

export default function AdminPage(){
 const [session,setSession]=useState(null),[profiles,setProfiles]=useState([]),[requests,setRequests]=useState([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
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
  try{
   const r=await getNhost().graphql.request({query:`mutation UpdateStatus($id:uuid!,$status:String!){update_service_requests_by_pk(pk_columns:{id:$id},_set:{status:$status}){id}}`,variables:{id,status}});
   if(r.body?.errors?.length)throw new Error(r.body.errors[0].message);
   await load();
  }catch(e){setError(e.message||"Could not update status.");}
 }
 if(loading)return <main className="portal-app"><div className="portal-loading">Loading admin workspace…</div></main>;
 if(!session)return <main className="portal-public"><div className="wrap onboarding-wrap"><div className="onboard-card"><h2>Sign in required</h2><Link href="/portal/sign-in">Client sign in</Link></div></div></main>;
 if(!session.user?.roles?.includes("admin"))return <main className="portal-public"><div className="wrap onboarding-wrap"><div className="onboard-card"><p className="eyebrow">RESTRICTED AREA</p><h2>Admin access only.</h2><p>This account does not have the admin role.</p><Link className="btn primary" href="/portal">Return to portal ↗</Link></div></div></main>;
 return <main className="portal-app"><div className="portal-topline"><div className="wrap"><Link href="/portal">← Client portal</Link><span>ADMIN WORKSPACE</span><Link href="/">Website ↗</Link></div></div><div className="wrap admin-content"><p className="eyebrow">OPERATIONS</p><h1>Client <span>overview.</span></h1>{error&&<p className="form-error">{error}</p>}<div className="portal-stats"><div className="portal-stat"><small>Total clients</small><b>{profiles.length}</b></div><div className="portal-stat"><small>Service requests</small><b>{requests.length}</b></div><div className="portal-stat"><small>New requests</small><b>{requests.filter(r=>r.status==="new").length}</b></div></div><h2 className="admin-heading">Recent enquiries</h2>{requests.map(r=><article className="request-card" key={r.id}><div className="request-card-top"><span className="request-id">{r.id.slice(0,8).toUpperCase()}</span><select value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}><option value="new">New</option><option value="reviewing">Reviewing</option><option value="proposal">Proposal</option><option value="in_progress">In progress</option><option value="on_hold">On hold</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div><h3>{(r.services||[]).join(" · ")}</h3><p>{r.project_brief}</p><small>Client: {profiles.find(p=>p.user_id===r.user_id)?.full_name||r.user_id}</small></article>)}</div></main>;
}
