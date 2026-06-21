/**
 * Studio에서 사용하는 zod 기반 입력/도메인 스키마 모음.
 *
 * 폼 입력과 API 페이로드가 공유 타입 규약을 어기지 않도록 런타임 검증 규칙을 제공한다.
 */
import { z } from "zod";

/** 지원하는 export 형식 목록을 제한하는 enum 스키마 */
export const exportFormatSchema = z.enum([
  "markdown",
  "jsonl",
  "parquet",
  "huggingface",
]);

/** 문자열 키와 문자열 값만 허용하는 공통 레코드 스키마 */
export const recordSchema = z.record(z.string(), z.string());

/** 단일 원본 데이터 참조가 가져야 할 필드를 검증하는 스키마 */
export const sourceRefSchema = z.object({
  provider: z.string().min(1, "제공자를 입력해주세요."),
  dataset: z.string().min(1, "데이터셋을 입력해주세요."),
  params: recordSchema,
  alias: z.string().min(1, "별칭은 비워둘 수 없습니다.").optional(),
});

/** 결과물 export 대상 정의를 검증하는 스키마 */
export const exportTargetSchema = z.object({
  format: exportFormatSchema,
  options: recordSchema.optional(),
});

/** 새 빌드 작성 화면에서 생성하는 전체 스펙 구조를 검증하는 스키마 */
export const buildSpecSchema = z.object({
  datasetId: z.string().min(1, "데이터셋 ID를 입력해주세요."),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  sources: z.array(sourceRefSchema).min(1, "소스를 최소 1개 추가해주세요."),
  exports: z.array(exportTargetSchema).min(1, "출력 형식을 최소 1개 선택해주세요."),
  metadata: recordSchema,
});

/** `buildSpecSchema`를 통과한 입력 타입 추론 결과 */
export type BuildSpecInput = z.infer<typeof buildSpecSchema>;
/** `exportTargetSchema`를 통과한 입력 타입 추론 결과 */
export type ExportTargetInput = z.infer<typeof exportTargetSchema>;
/** `sourceRefSchema`를 통과한 입력 타입 추론 결과 */
export type SourceRefInput = z.infer<typeof sourceRefSchema>;
