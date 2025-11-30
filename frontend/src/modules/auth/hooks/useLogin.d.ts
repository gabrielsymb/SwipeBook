import type { ApiErrorResponse, AuthResponse, LoginRequestDTO } from "../../../api/types";
export declare function useLogin(): import("@tanstack/react-query").UseMutationResult<AuthResponse, ApiErrorResponse, LoginRequestDTO, unknown>;
