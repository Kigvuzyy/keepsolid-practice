import type axios from "axios";
import type { AxiosResponse } from "axios";
import type { IResendEmailBody, ISignInBody, ISignUpBody } from "@kigvuzyy/types";

import { config } from "@/lib/config";
import { AxiosService } from "@/services/axios";

export let axiosAuthInstance: ReturnType<typeof axios.create>;

class AuthService {
	public readonly axiosService: AxiosService;

	public constructor() {
		this.axiosService = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, "auth");
		axiosAuthInstance = this.axiosService.axios;
	}

	public async getCurrentUser(): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosAuthInstance.get("/currentuser");
		return response;
	}

	public async getRefreshToken(username: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosAuthInstance.get(`/refresh-token/${username}`);
		return response;
	}

	public async changePassword(
		currentPassword: string,
		newPassword: string,
	): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosAuthInstance.put("/change-password", {
			currentPassword,
			newPassword,
		});
		return response;
	}

	public async verifyEmail(token: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosAuthInstance.put("/verify-email", { token });
		return response;
	}

	public async resendEmail(body: IResendEmailBody): Promise<AxiosResponse> {
		const response: AxiosResponse = await axiosAuthInstance.post("/resend-email", body);
		return response;
	}

	public async signUp(body: ISignUpBody): Promise<AxiosResponse> {
		const response: AxiosResponse = await this.axiosService.axios.post("/signup", body);
		return response;
	}

	public async signIn(body: ISignInBody): Promise<AxiosResponse> {
		const response: AxiosResponse = await this.axiosService.axios.post("/signin", body);
		return response;
	}

	public async forgotPassword(email: string): Promise<AxiosResponse> {
		const response: AxiosResponse = await this.axiosService.axios.put("/forgot-password", {
			email,
		});
		return response;
	}

	public async resetPassword(
		token: string,
		password: string,
		confirmPassword: string,
	): Promise<AxiosResponse> {
		const response: AxiosResponse = await this.axiosService.axios.put(
			`/reset-password/${token}`,
			{ password, confirmPassword },
		);
		return response;
	}
}

export const authService: AuthService = new AuthService();
