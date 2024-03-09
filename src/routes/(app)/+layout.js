import { decodeJwt } from '$utils/jwt';
export const ssr = false;

export function load({ url }) {
	try {
		const token = localStorage.getItem('token');

		if (!token) {
			location.href = '/';
		}

		const decodedUser = decodeJwt(token);
		// const { user_id } = await decode(token);
		// console.log(decodedUser);

		// const {
		//     data: { data },
		// } = await api.get(/users/${user_id});

		return {
			user: decodedUser,
			url: url.pathname
		};
		// const currentPath = e.url.pathname.split("/")[1];
		// const roles = ["monitoring_center", "binda", "pimpinan", "tata_usaha", "direktur", "kasubidt", "subdit"];

		// if (roles.includes(currentPath) && data.role !== currentPath) {
		//     return error(404);
		// }

		// if (roles.includes(currentPath)) {
		//     return;
		// }

		// location.href = /${data.role};
	} catch (err) {
		if (err.status === 401) {
			location.href = '/';
			return;
		}

		throw err;
	}
}
