export const getUnitPath = (...args: (string | undefined | null)[]): string => args.reduce<string>((path, next) => `${path}${next ? `/${next}` : ''}`, '').slice(1)
