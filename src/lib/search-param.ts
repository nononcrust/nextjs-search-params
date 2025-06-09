import { z } from "zod/v4";

const Page = z.coerce.number().int().positive();

const StarRating = z.enum(["1", "2", "3", "4", "5"]).transform(Number);

const Boolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const CommaSeparatedStringToArray = z
  .string()
  .transform((value) => value.split(","))
  .readonly();

const ArrayOf = <T extends readonly string[]>(value: T) =>
  CommaSeparatedStringToArray.pipe(z.array(z.enum(value)).readonly());

const OneOf = <T extends readonly string[]>(value: T) => z.enum(value);

export const SearchParam = {
  /**
   * 페이지 번호를 나타내는 쿼리 파라미터를 정의합니다.
   * 페이지 번호는 양의 정수로 표현됩니다.
   *
   * @example
   * SearchParam.Page.catch(1)
   *
   * "1" -> 1
   * "2" -> 2
   * "3" -> 3
   */
  Page,
  /**
   * boolean을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.Boolean.catch(false)
   *
   * "true" -> true
   * "false" -> false
   */
  Boolean,
  /**
   * 문자열로 이루어진 배열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.ArrayOf(["book", "clothing"]).catch([])
   *
   * "book%2Cclothing" -> ["book", "clothing"]
   */
  ArrayOf,
  /**
   * 특정 문자열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.Enum(["asc", "desc"]).catch("asc")
   */
  OneOf,
  StarRating,
};
