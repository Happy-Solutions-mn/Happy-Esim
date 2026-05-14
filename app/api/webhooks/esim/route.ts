// import { NextRequest } from "next/server";
// import { getAdminDb } from "@/lib/firebase-admin";
// export const runtime = 'edge';
// // eSIM Access sends webhooks for events like profile allocation, expiry, etc.
// export async function POST(request: NextRequest) {
//   try {
//     const payload = await request.json();
//     console.log("[webhooks/esim] Received:", JSON.stringify(payload));

//     const { orderNo, iccid, status, event } = payload;

//     if (!orderNo && !iccid) {
//       return Response.json({ received: true });
//     }

//     // Update matching order in Firestore
//     const adminDb = getAdminDb();
//     const query = orderNo
//       ? adminDb.collection("orders").where("orderNo", "==", orderNo)
//       : adminDb.collection("orders").where("iccid", "==", iccid);

//     const snapshot = await query.limit(5).get();

//     if (!snapshot.empty) {
//       const batch = adminDb.batch();
//       snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
//         batch.update(doc.ref, {
//           status: status || event || "updated",
//           lastWebhookAt: new Date(),
//           webhookPayload: payload,
//         });
//       });
//       await batch.commit();
//     }

//     return Response.json({ received: true });
//   } catch (err) {
//     console.error("[webhooks/esim] Error:", err);
//     // Always return 200 to prevent retries for parsing errors
//     return Response.json({ received: true });
//   }
// }
