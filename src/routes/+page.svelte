<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
	import { timestampToDate } from '$lib/timestampToDate';
	import app from '$lib/firebaseConfig';

	let items: any[] = [];

	const firestore = getFirestore(app);

	onMount(async () => {
		const itemCollection = collection(firestore, 'main');
		const itemQuery = query(itemCollection, orderBy('createAt', 'desc'));
		const querySnapshot = await getDocs(itemQuery);

		items = querySnapshot.docs.map((doc) => doc.data());
	});

	function isWithin15Minutes(timestamp: { seconds: number; nanoseconds: number }) {
		const currentTime = new Date().getTime();
		const itemTime = new Date(timestamp.seconds * 1000).getTime();
		const fifteenMinutesInMillis = 15 * 60 * 1000;
		return currentTime - itemTime < fifteenMinutesInMillis;
	}
</script>

<table class="table w-full table-zebra table-pin-rows shadow-xl">
	<thead>
		<tr>
			<th class="px-4 py-2 text-left">ชื่อ</th>
			<th class="px-4 py-2 text-left">ระบบ</th>
			<th class="px-4 py-2 text-left">วันเวลา</th>
			<th class="px-4 py-2 text-left">ขอรหัส</th>
		</tr>
	</thead>
	<tbody>
		{#each items as item}
			<tr>
				<td class="px-4 py-2">
					<div class="flex items-center">
						<div class="avatar">
							<div class="w-5 h-5 rounded-lg">
								{#if item.img}
									<img src={item.img} alt="Avatar" class="rounded-lg" />
								{/if}
							</div>
						</div>
						<div class="ml-2">{item.requester}</div>
					</div>
				</td>
				<td class="px-4 py-2">
					{item.device}
				</td>
				<td class="px-4 py-2">
					{#if item.time}
						{timestampToDate(item.time)?.toLocaleDateString('th-TH', {
							day: '2-digit',
							month: '2-digit',
							hour: '2-digit',
							minute: '2-digit'
						})}
					{/if}
				</td>
				<td class="px-4 py-2">
					{#if isWithin15Minutes(item.time)}
						<a href={item.link} class="text-blue-500 underline">คลิก</a>
					{:else}
						<span class="text-red-500 font-semibold">หมดอายุ</span>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
